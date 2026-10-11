const express = require('express');
const router = express.Router();
const db = require('../db');
const { optionalAuth } = require('../middleware/auth');

function getWishlist(userId, guestId) {
  let wishlist = null;
  if (userId) {
    wishlist = db.findOne('wishlists', w => w.userId === userId);
    if (!wishlist && guestId) {
      const guestWishlist = db.findOne('wishlists', w => w.guestId === guestId && !w.userId);
      if (guestWishlist) {
        wishlist = db.update('wishlists', guestWishlist.id, { userId });
      }
    }
  } else if (guestId) {
    wishlist = db.findOne('wishlists', w => w.guestId === guestId && !w.userId);
  }

  if (!wishlist) {
    wishlist = db.insert('wishlists', {
      userId: userId || null,
      guestId: guestId || null,
      productIds: []
    });
  }

  return wishlist;
}

// Get Wishlist
router.get('/', optionalAuth, (req, res) => {
  const userId = req.user ? req.user.id : null;
  const guestId = req.headers['x-guest-id'] || req.query.guestId;

  const wishlist = getWishlist(userId, guestId);
  const products = db.find('products');

  const populated = (wishlist.productIds || [])
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  res.json({
    success: true,
    data: populated,
    productIds: wishlist.productIds || []
  });
});

// Toggle Item in Wishlist
router.post('/toggle', optionalAuth, (req, res) => {
  const userId = req.user ? req.user.id : null;
  const guestId = req.headers['x-guest-id'] || req.body.guestId;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, message: 'Product ID is required.' });
  }

  const wishlist = getWishlist(userId, guestId);
  let ids = wishlist.productIds || [];
  let isAdded = false;

  if (ids.includes(productId)) {
    ids = ids.filter(id => id !== productId);
    isAdded = false;
  } else {
    ids.push(productId);
    isAdded = true;
  }

  db.update('wishlists', wishlist.id, { productIds: ids });

  res.json({
    success: true,
    message: isAdded ? 'Added to your wishlist' : 'Removed from your wishlist',
    isWishlisted: isAdded,
    productIds: ids
  });
});

// Remove item from wishlist
router.delete('/:productId', optionalAuth, (req, res) => {
  const userId = req.user ? req.user.id : null;
  const guestId = req.headers['x-guest-id'] || req.query.guestId;
  const { productId } = req.params;

  const wishlist = getWishlist(userId, guestId);
  const ids = (wishlist.productIds || []).filter(id => id !== productId);
  db.update('wishlists', wishlist.id, { productIds: ids });

  res.json({
    success: true,
    message: 'Removed from wishlist',
    productIds: ids
  });
});

module.exports = router;
