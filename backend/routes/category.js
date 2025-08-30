import express from 'express';
import slugify from 'slugify';
import Category from '../models/category.js';

const router = express.Router();

/**
 * POST /api/categories
 * Create a new category
 */
router.post('/add-category', async (req, res) => {
  try {
    const { name, description = '', image = '', slug } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: 'Category name is required' });

    // check existing by name or slug
    const existing = await Category.findOne({ $or: [{ name: name.trim() }, { slug }] });
    if (existing) return res.status(400).json({ message: 'Category with this name/slug already exists' });

    const finalSlug = slug && slug.trim()
      ? slug.trim()
      : slugify(name, { lower: true, strict: true });

    const category = new Category({
      name: name.trim(),
      description,
      image,
      slug: finalSlug
    });

    await category.save();
    return res.status(201).json({ message: 'Category created', category });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});



/**
 * GET /api/categories
 * List all categories
 */
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * GET /api/categories/:id
 * Get category by id
 */
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * PUT /api/categories/:id
 * Update a category
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, description, image, slug } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (description !== undefined) updates.description = description;
    if (image !== undefined) updates.image = image;
    updates.slug = slug ? slug.trim() : (name ? slugify(name, { lower: true, strict: true }) : undefined);

    const updated = await Category.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category updated', category: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * DELETE /api/categories/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Category.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
