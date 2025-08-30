import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "seller"], required: true },

  verificationToken: { type: String }, // for email verification code/link
  isVerified: { type: Boolean, default: false }, // status flag

  sellingHistory: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      quantity: Number,
      dateSold: { type: Date, default: Date.now }
    }
  ],

  bookingHistory: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      quantity: Number,
      dateBooked: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
