import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import BlogRoutes from './routes/blog.routes.js';
import queryRouter from './routes/queries.routes.js';
import bodyParser from 'body-parser';
import authenticationRoutes from './routes/auth.routes.js';
import * as confing_file from './configuration/passport.js';
const PORT = process.env.PORT || 3000;
const app = express();
app.use(
  bodyParser.json({
    limit: '50mb',
  }),
);
app.use(
  session({
    secret: 'this is the key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
confing_file.login(passport);
app.use(express.urlencoded({ extended: false }));
app.use('/api', queryRouter);
app.use('/api', BlogRoutes);
app.use('/api', authenticationRoutes);
app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    success: true,
    message: 'Welcome',
  });
});
app.listen(`${PORT}`, () => {
  console.log(`Server has started on http://localhost:${PORT} `);
});
if (process.env.NODE_ENV !== 'test') {
  mongoose.set('strictQuery', false);
  mongoose
    .connect("mongodb+srv://Jmukakalisa:Wharfdaycare%401@cluster0.fjkf6.mongodb.net/restFull-api?retryWrites=true&w=majority", {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log('DB Connected');
    })
    .catch((error) => {
      console.log(error);
    });
}

export default app;
