import express from 'express';
import mongoose from 'mongoose';
import BlogRoutes from './routes/blog.routes.js';
import queryRouter from './routes/queries.routes.js';
import bodyParser from 'body-parser';

const app = express();
app.use(
  bodyParser.json({
    limit: '50mb',
  }),
);
// app.use(express.urlencoded({ extended: false }));
// app.use('/api', queryRouter);
// app.use('/api', BlogRoutes);
// app.listen(5000, () => {
//   console.log('Server has started!');
// });

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://Jmukakalisa:Wharfdaycare%401@cluster0.fjkf6.mongodb.net/restFull-api?retryWrites=true&w=majority",
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
  app.use(express.urlencoded({ extended: false }));
  app.use('/api', queryRouter);
  app.use('/api', BlogRoutes);

    app.listen(3000, () => {
        console.log("App connected to mongoDB successfully");
        console.log("Server has started successfully!")
    })
})
.catch((e) => {
    console.log("Mongodb connection error "+e.message);
})
