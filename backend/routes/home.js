import express from 'express';
import jwt from 'jsonwebtoken';

const homeRoute = express.Router();

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
}

homeRoute.get("/", verifyToken, async (req, res) => {
    res.json({
        "Title": "Top Secret List",
        "Body": "You are chosen"
    });
});

export default homeRoute;
