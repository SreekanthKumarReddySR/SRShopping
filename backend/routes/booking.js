import express from "express";
import Product from '../models/product.js';
import User from '../models/user.js';
import { verifyRole } from '../middlewares/verifyRole.js';
import  verify  from '../middlewares/verifyToken.js';
const bookingRouter = express.Router();

bookingRouter.post("/:productId",verify, verifyRole("customer"), async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.productId);
    
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ error: "Not enough stock" });

    // Reduce stock
    product.stock -= quantity;
    await product.save();

    // Update customer booking history
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        bookingHistory: {
          product: product._id,
          seller: product.createdBy,
          quantity
        }
      }
    });

    // Update seller selling history
    await User.findByIdAndUpdate(product.createdBy, {
      $push: {
        sellingHistory: {
          product: product._id,
          buyer: req.user._id,
          quantity
        }
      }
    });

    res.json({ message: "Booking successful", remainingStock: product.stock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default bookingRouter;
