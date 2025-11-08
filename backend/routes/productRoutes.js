import express from 'express';
import Product from '../models/product.js';
import Category from '../models/category.js';
import { verifyRole } from '../middlewares/verifyRole.js';
import  verify  from '../middlewares/verifyToken.js';
const router = express.Router();

/**
 * @route   POST /api/products
 * @desc    Create a new product
 */



router.post('/add-product', verify, verifyRole("seller"), async (req, res) => {
  try {
    const {
      title,
      imageLinks,
      category, // now category name
      price,
      discountPrice,
      description,
      stock,
      deliveryType,
      brand,
      sku,
      tags,
      isFeatured
    } = req.body;

    const createdBy = req.user._id;

    // ✅ Find or create category by name
    let categoryData = await Category.findOne({ name: new RegExp(`^${category}$`, 'i') });
    if (!categoryData) {
      categoryData = new Category({ name: category });
      await categoryData.save();
      console.log(`Created new category: ${category}`);
    }

    // ✅ Create product linked to that category
    const newProduct = new Product({
      title,
      imageLinks,
      category: categoryData._id,
      price,
      discountPrice,
      description,
      deliveryType,
      brand,
      sku,
      tags,
      isFeatured,
      createdBy,
      stock
    });

    await newProduct.save();

    res.status(201).json({
      message: `Product created successfully under category '${categoryData.name}'`,
      product: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


/**
 * @route   GET /api/products/title/:title
 * @desc    Get product(s) by title (partial match)
 */
router.get('/title/:title', async (req, res) => {
    try {
        const products = await Product.find({
            title: { $regex: req.params.title, $options: 'i' }
        }).populate('category', 'name description image');

        if (!products.length) {
            return res.status(404).json({ message: "No products found" });
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

/**
 * @route   GET /api/products/category/:categoryId
 * @desc    Get products by category ID
 */
router.get('/category/:categoryId', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.categoryId })
            .populate('category', 'name description image');

        if (!products.length) {
            return res.status(404).json({ message: "No products found in this category" });
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

/**
 * @route   GET /api/products/price
 * @desc    Get products by price range (min & max)
 * @query   min, max
 * @example /api/products/price?min=100&max=500
 */
router.get('/price', async (req, res) => {
    try {
        const min = parseFloat(req.query.min) || 0;
        const max = parseFloat(req.query.max) || Number.MAX_VALUE;

        const products = await Product.find({
            price: { $gte: min, $lte: max }
        }).populate('category', 'name description image');

        if (!products.length) {
            return res.status(404).json({ message: "No products found in this price range" });
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

/**
 * @route   GET /api/products/brand/:brand
 * @desc    Get products by brand
 */
router.get('/brand/:brand', async (req, res) => {
    try {
        const products = await Product.find({
            brand: { $regex: req.params.brand, $options: 'i' }
        }).populate('category', 'name description image');

        if (!products.length) {
            return res.status(404).json({ message: "No products found for this brand" });
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
