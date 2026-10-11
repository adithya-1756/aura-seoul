const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Get product reviews & statistics
router.get('/product/:productId', (req, res) => {
  const reviews = db.find('reviews', r => r.productId === req.params.productId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = reviews.length;
  const average = total > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : 0;

  // Rating distribution
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    if (distribution[r.rating] !== undefined) distribution[r.rating]++;
  });

  res.json({
    success: true,
    data: {
      reviews,
      total,
      average: parseFloat(average),
      distribution
    }
  });
});

// Add Review (Authenticated)
router.post('/', authenticateToken, (req, res) => {
  const { productId, rating, title, comment } = req.body;

  if (!productId || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'Product ID, star rating, and review text are required.' });
  }

  const numRating = parseInt(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars.' });
  }

  const product = db.findById('products', productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  // Check if customer ordered this product
  const orders = db.find('orders', o => o.userId === req.user.id);
  const isVerified = orders.some(o => o.items && o.items.some(it => it.productId === productId));

  const newReview = db.insert('reviews', {
    productId,
    userId: req.user.id,
    userName: req.user.name,
    rating: numRating,
    title: title ? title.trim() : '',
    comment: comment.trim(),
    isVerifiedPurchase: isVerified
  });

  // Recalculate product rating
  const allProductReviews = db.find('reviews', r => r.productId === productId);
  const avg = (allProductReviews.reduce((sum, r) => sum + r.rating, 0) / allProductReviews.length).toFixed(1);
  db.update('products', productId, {
    ratingsAverage: parseFloat(avg),
    ratingsCount: allProductReviews.length
  });

  res.status(201).json({
    success: true,
    message: 'Thank you! Your review has been published.',
    data: newReview
  });
});

module.exports = router;
