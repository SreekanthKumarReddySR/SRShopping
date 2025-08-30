import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { registerValidation, loginValidation } from '../validations/validation.js';

const authRoute = express.Router();

// Register Route
// routes/auth.js
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';

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
        console.log(err);
        res.status(500).send("Error creating account");
    }
});

authRoute.get('/verify/:token', async (req, res) => {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).send("Invalid or expired verification token");

    user.isVerified = true;
    user.verificationToken = undefined; // clear token
    await user.save();

    res.send("Email verified successfully. You can now log in.");
});

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
    res.status(200).json({ message: "Login successful", token });

});

export default authRoute;
