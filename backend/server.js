// server.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';
import express from 'express';
import cors from 'cors';

dotenv.config();
mongoose.set('strictQuery', false);

const PORT = parseInt(process.env.PORT);
const DB_URI = process.env.MONGO_URI;

//Allow both local and deployed frontends
const allowedOrigins = [
  "http://localhost:3000",
  , // your Vercel frontend
];


// Setup CORS properly
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman or mobile)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect(DB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Database connection is Ready and Server is Listening on Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to database:", err);
  });

