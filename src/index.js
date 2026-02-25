import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/authRouter.js'
import mongoose from 'mongoose';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import cookieParser from 'cookie-parser';
import productRouter from './routes/productRouter.js';
import orderRouter from './routes/orderRouter.js';
import helmet from 'helmet'
// import ExpressMongoSanitize from 'express-mongo-sanitize';
import {v2 as cloudinary} from 'cloudinary'


dotenv.config();

const app = express();
const PORT = process.env.PORT ;

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

app.use(helmet())
// app.use(ExpressMongoSanitize())
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('src/public'));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/order', orderRouter)

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})

mongoose.connect(process.env.DATABASE_URL, {
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log("Failed to connect to MongoDB", err);
});