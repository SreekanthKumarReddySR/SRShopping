import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    imageLinks: {
        type: [String],
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to Category collection
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        default: null
    },
    description: {
        type: String,
        required: true
    },
    reviews: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            rating: { type: Number, min: 1, max: 5 },
            comment: String,
            createdAt: { type: Date, default: Date.now }
        }
    ],
    deliveryType: {
        type: String,
        enum: ['Standard', 'Express', 'Same-day'],
        default: 'Standard'
    },
    brand: {
        type: String,
        default: 'Unbranded'
    },
    sku: {
        type: String,
        unique: false,
    },
    tags: {
        type: [String],
        default: []
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    stock: { 
        type: Number, 
        required: true, 
        min: 0 
    }, // total quantity available
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
});

export default mongoose.model('Product', productSchema);
