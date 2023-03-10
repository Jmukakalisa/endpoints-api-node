import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import BlogRoutes from './routes/blogRoutes.js';
import queryRouter from './routes/queryRoutes.js'
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import authenticationRoutes from './routes/authRoutes.js';
import * as confing_file from './configuration/passport.js';
import swaggerDocument from './swagger.js';
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(morgan("tiny"));
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "https://jmukakalisa.onrender.com"); // Replace "*" with the domain you want to allow cross-origin requests from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
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
  console.log(`Server has started on http://localhost:3000 `);
});
// if (process.env.NODE_ENV !== 'test') {
  mongoose.set('strictQuery', false);
  mongoose
    .connect(process.env.mongo_url, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("Application connected to mongoDB successfully");
      swaggerDocument(app, PORT);
    })
    .catch((error) => {
      console.log(error);
    });
// }

export default app;
