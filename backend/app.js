// app.js
import express from 'express';
import dotenv from 'dotenv';
import homeRoute from './routes/home.js';
import authRoute from './routes/auth.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/category.js';
import bookingRouter from './routes/booking.js';
dotenv.config();
import cors from "cors";

const app = express();

// ✅ Enable CORS for all origins (you can restrict to your frontend URL if needed)
app.use(cors({
  origin: "https://sr-shopping.vercel.app/api" ||  process.env.FRONTEND_URL || "http://localhost:3000", 
  credentials: true, // allow cookies if you use them
}));

app.use(express.json());

app.use('/api/categories/', categoryRoutes);
app.use('/', homeRoute);
app.use('/api/user/', authRoute);
app.use('/api/products/', productRoutes);
app.use('/api/bookings/', bookingRouter);

export default app;
