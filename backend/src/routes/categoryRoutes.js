const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all categories with product counts
router.get('/', (req, res) => {
  const categories = db.find('categories');
  const products = db.find('products');

  const categoriesWithCounts = categories.map(cat => {
    const count = products.filter(p => p.categoryId === cat.id).length;
    return {
      ...cat,
      productCount: count
    };
  }).sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));

  res.json({
    success: true,
    data: categoriesWithCounts
  });
});

// Get single category by slug
router.get('/:slug', (req, res) => {
  const category = db.findOne('categories', c => c.slug === req.params.slug);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found.' });
  }

  const products = db.find('products', p => p.categoryId === category.id);
  res.json({
    success: true,
    data: {
      ...category,
      productCount: products.length
    }
  });
});

module.exports = router;
