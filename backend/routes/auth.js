import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { registerValidation, loginValidation } from '../validations/validation.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';
import Product from '../models/product.js';
import verify from '../middlewares/verifyToken.js';
const authRoute = express.Router();

// ✅ Register Route
authRoute.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send("Email already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Generate 6-digit numeric verification code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
        verificationToken
    });

    try {
        await user.save();

        const verifyLink = `${process.env.BASE_URL}/api/user/verify/${verificationToken}`;
        await sendEmail(
            user.email,
            "Verify Your Email",
            `<h1>Email Verification</h1>
             <p>Click the link below to verify your email:</p>
             <a href="${verifyLink}">${verifyLink}</a>`
        );

        res.send("Account created! Please check your email for verification link.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating account");
    }
});

// ✅ Email Verification
authRoute.get('/verify/:token', async (req, res) => {
    console.log('Verification token received:', req.params.token);
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).send("Invalid or expired verification token");

    user.isVerified = true;
    user.verificationToken = undefined; // clear token
    await user.save();

    res.send("Email verified successfully. You can now log in.");
});

// ✅ Login Route
authRoute.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email is incorrect");

    if (!user.isVerified) {
        return res.status(400).send("Please verify your email before logging in.");
    }

    const isValidPass = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPass) return res.status(400).send("Password is incorrect");

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.header("Access-Control-Expose-Headers", "auth-token");
    res.header("auth-token", token);
    console.log("✅ Login successful, token generated:", token);

    // Send token + user info
    res.status(200).json({
        message: "Login successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// ✅ NEW: Get current logged-in user
authRoute.get('/me', verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -verificationToken')
      .populate({
        path: 'bookingHistory.product',
        select: 'title price discountPrice category',
        populate: {
          path: 'category',
          select: 'name'
        }
      })
      .populate({
        path: 'bookingHistory.seller',
        select: 'name email'
      });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (err) {
    console.error('Error in /user/me:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

authRoute.get('/bookings/details', verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('bookingHistory');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const detailedBookings = await Promise.all(
      user.bookingHistory.map(async (booking) => {
        const product = await Product.findById(booking.product)
          .populate('category', 'name')
          .populate('createdBy', 'name email role');

        if (!product) {
          return {
            ...booking.toObject(),
            product: null,
            seller: null,
            price: 0,
          };
        }

        return {
          _id: booking._id,
          quantity: booking.quantity,
          dateBooked: booking.dateBooked,
          product: {
            _id: product._id,
            title: product.title,
            brand: product.brand,
            price: product.price,
            discountPrice: product.discountPrice,
            category: product.category?.name || 'N/A',
          },
          seller: product.createdBy
            ? { name: product.createdBy.name, email: product.createdBy.email }
            : null,
        };
      })
    );

    res.json({ bookings: detailedBookings });
  } catch (err) {
    console.error('Error fetching booking details:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

authRoute.get('/sales/details', verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('sellingHistory');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const detailedSales = await Promise.all(
      user.sellingHistory.map(async (sale) => {
        const product = await Product.findById(sale.product)
          .populate('category', 'name');

        if (!product) {
          return {
            ...sale.toObject(),
            product: null,
            price: 0,
            category: 'N/A',
          };
        }

        const price = product.discountPrice || product.price || 0;
        const revenue = price * sale.quantity;

        return {
          _id: sale._id,
          quantity: sale.quantity,
          dateSold: sale.dateSold,
          product: {
            _id: product._id,
            title: product.title,
            price: product.price,
            discountPrice: product.discountPrice,
            category: product.category?.name || 'N/A',
          },
          buyer: sale.buyer, // ID only (optional populate if needed)
          revenue,
        };
      })
    );

    res.json({ sales: detailedSales });
  } catch (err) {
    console.error('Error fetching sales details:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default authRoute;
