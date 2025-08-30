// app.js
import express from 'express';
import dotenv from 'dotenv';
import homeRoute from './routes/home.js';
import authRoute from './routes/auth.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/category.js';
import bookingRouter from './routes/booking.js';
dotenv.config();
const app = express();

app.use(express.json());

app.use('/api/categories/', categoryRoutes);
app.use('/', homeRoute);
app.use('/api/user/', authRoute);
app.use('/api/products/', productRoutes);
app.use('/api/bookings/', bookingRouter);

export default app;
