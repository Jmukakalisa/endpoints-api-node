import express from 'express';
import mongoose from 'mongoose';
import BlogRoutes from './routes/blogRoutes.js';
import queryRouter from './routes/queryRoutes.js';
// import bodyParser from 'body-parser';
// import * as confing_file from './config/authPassport.js';
import authenticationRoutes from './routes/authRoutes.js';
const PORT = process.env.PORT || 3000;

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://Jmukakalisa:Wharfdaycare%401@cluster0.fjkf6.mongodb.net/restFull-api?retryWrites=true&w=majority",
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
  // app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
  app.use('/api', queryRouter);
  app.use('/api', BlogRoutes);
  app.use('/api', authenticationRoutes);
  // confing_file.login(passport);
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Succeful',
    });
  });
  // app.use(cors({
  //   origin: 'http://localhost:3000',
  //   credentials: true,
  // }));

  app.listen(`${PORT}`, () => {
    console.log(`Server has started successfully on http://localhost:${PORT} `);
    console.log("App connected to mongoDB successfully");
    })
})
.catch((e) => {
    console.log("Mongodb connection error "+e.message);
})

