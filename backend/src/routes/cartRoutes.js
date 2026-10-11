const express = require('express');
const router = express.Router();
const db = require('../db');
const { optionalAuth } = require('../middleware/auth');

// Helper to get or create cart
function getCart(userId, guestId) {
  let cart = null;
  if (userId) {
    cart = db.findOne('carts', c => c.userId === userId);
    // If user has no cart but guestId exists, merge guest cart into user cart
    if (!cart && guestId) {
      const guestCart = db.findOne('carts', c => c.guestId === guestId && !c.userId);
      if (guestCart) {
        cart = db.update('carts', guestCart.id, { userId });
      }
    }
  } else if (guestId) {
    cart = db.findOne('carts', c => c.guestId === guestId && !c.userId);
  }

  if (!cart) {
    cart = db.insert('carts', {
      userId: userId || null,
      guestId: guestId || null,
      items: [],
      appliedCoupon: null
    });
  }

  return cart;
}

// Calculate cart totals with server-side validation
function calculateCartTotals(cart) {
  const products = db.find('products');
  let subtotal = 0;
  let populatedItems = [];

  for (const item of cart.items) {
    const product = products.find(p => p.id === item.productId);
    if (!product) continue;

    // Verify variant stock
    const variant = (product.variants || []).find(v => v.size === item.size && (!item.color || v.color === item.color));
    const availableStock = variant ? variant.stock : 20;

    const price = product.price;
    const itemTotal = price * item.quantity;
    subtotal += itemTotal;

    populatedItems.push({
      ...item,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        images: product.images,
        fabric: product.fabric
      },
      availableStock,
      itemTotal
    });
  }

  // Shipping threshold: ₹999 for free shipping, else ₹99
  const settings = db.getContent().siteSettings || {};
  const threshold = settings.freeShippingThreshold || 999;
  const standardFee = settings.standardShippingFee || 99;

  let shippingFee = subtotal >= threshold || subtotal === 0 ? 0 : standardFee;
  let discountAmount = 0;

  // Coupon calculation
  if (cart.appliedCoupon) {
    const coupon = db.findOne('coupons', c => c.code === cart.appliedCoupon && c.isActive);
    if (coupon) {
      if (coupon.discountType === 'shipping') {
        shippingFee = 0;
        discountAmount += standardFee;
      } else if (coupon.discountType === 'percentage') {
        const calculated = Math.round((subtotal * coupon.discountValue) / 100);
        discountAmount = coupon.maxDiscountAmount ? Math.min(calculated, coupon.maxDiscountAmount) : calculated;
      } else if (coupon.discountType === 'fixed') {
        discountAmount = Math.min(coupon.discountValue, subtotal);
      }
    }
  }

  const taxAmount = Math.round((subtotal - discountAmount) * 0.05); // 5% GST included or added
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);
  const freeShippingDifference = Math.max(0, threshold - subtotal);

  return {
    items: populatedItems,
    subtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    finalTotal,
    appliedCoupon: cart.appliedCoupon,
    freeShippingThreshold: threshold,
    freeShippingDifference,
    isEligibleForFreeShipping: subtotal >= threshold
  };
}

// Get Cart
router.get('/', optionalAuth, (req, res) => {
  const userId = req.user ? req.user.id : null;
  const guestId = req.headers['x-guest-id'] || req.query.guestId;

  const cart = getCart(userId, guestId);
  const calculated = calculateCartTotals(cart);

  res.json({
    success: true,
    data: calculated
  });
});

// Add Item to Cart
router.post('/add', optionalAuth, (req, res) => {
  const userId = req.user ? req.user.id : null;
  const guestId = req.headers['x-guest-id'] || req.body.guestId;
  const { productId, size, color, quantity = 1 } = req.body;

  if (!productId || !size) {
    return res.status(400).json({ success: false, message: 'Product ID and size are required.' });
  }

  const product = db.findById('products', productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  // Validate variant stock
  const variant = (product.variants || []).find(v => v.size === size && (!color || v.color === color));
  const availableStock = variant ? variant.stock : 20;

  if (availableStock <= 0) {
    return res.status(400).json({ success: false, message: 'Selected size and color is currently out of stock.' });
  }

  const cart = getCart(userId, guestId);
  const existingItemIndex = cart.items.findIndex(
    item => item.productId === productId && item.size === size && item.color === color
  );

  if (existingItemIndex > -1) {
    const newQty = cart.items[existingItemIndex].quantity + quantity;
    if (newQty > availableStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableStock} items available in stock for this variant.`
      });
    }
    cart.items[existingItemIndex].quantity = newQty;
  } else {
    if (quantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableStock} items available in stock for this variant.`
      });
    }
    cart.items.push({
      productId,
      size,
      color: color || (product.colors && product.colors[0] ? product.colors[0].name : 'Default'),
      quantity
    });
  }

  db.update('carts', cart.id, { items: cart.items });
  const calculated = calculateCartTotals(cart);

  res.json({
    success: true,
    message: `Added ${product.name} to shopping bag.`,
    data: calculated
  });
});

// Update Item Quantity
router.put('/update', optionalAuth, (req, res) => {
  const userId = req.user ? req.user.id : null;
  const guestId = req.headers['x-guest-id'] || req.body.guestId;
  const { productId, size, color, quantity } = req.body;

  const cart = getCart(userId, guestId);
  const itemIndex = cart.items.findIndex(
    item => item.productId === productId && item.size === size && item.color === color
  );

  if (itemIndex === -1) {
    return res.status(404).json({ success: false, message: 'Item not found in cart.' });
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    // Check stock
    const product = db.findById('products', productId);
    const variant = product && (product.variants || []).find(v => v.size === size && (!color || v.color === color));
    const availableStock = variant ? variant.stock : 20;

    if (quantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: `Maximum stock reached (${availableStock} items available).`
      });
    }
    cart.items[itemIndex].quantity = quantity;
  }

  db.update('carts', cart.id, { items: cart.items });
  const calculated = calculateCartTotals(cart);

  res.json({
    success: true,
    data: calculated
  });
});

// Remove Item
router.delete('/remove', optionalAuth, (req, res) => {
  const userId = req.user ? req.user.id : null;
  const guestId = req.headers['x-guest-id'] || req.body.guestId;
  const { productId, size, color } = req.body;

  const cart = getCart(userId, guestId);
  cart.items = cart.items.filter(
    item => !(item.productId === productId && item.size === size && item.color === color)
  );

  db.update('carts', cart.id, { items: cart.items });
  const calculated = calculateCartTotals(cart);

  res.json({
    success: true,
    message: 'Item removed from bag.',
    data: calculated
  });
});

// Apply Coupon
router.post('/apply-coupon', optionalAuth, (req, res) => {
  const userId = req.user ? req.user.id : null;
  const guestId = req.headers['x-guest-id'] || req.body.guestId;
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: 'Please enter a coupon code.' });
  }

  const cleanCode = code.trim().toUpperCase();
  const coupon = db.findOne('coupons', c => c.code === cleanCode && c.isActive);

  if (!coupon) {
    return res.status(400).json({ success: false, message: 'Invalid or expired coupon code.' });
  }

  const cart = getCart(userId, guestId);
  // Calculate current subtotal
  const products = db.find('products');
  let subtotal = 0;
  for (const item of cart.items) {
    const prod = products.find(p => p.id === item.productId);
    if (prod) subtotal += prod.price * item.quantity;
  }

  if (subtotal < coupon.minOrderValue) {
    return res.status(400).json({
      success: false,
      message: `Coupon ${coupon.code} requires a minimum order value of ₹${coupon.minOrderValue}. Add items worth ₹${coupon.minOrderValue - subtotal} more.`
    });
  }

  // Check first order restriction
  if (coupon.firstOrderOnly && userId) {
    const previousOrders = db.find('orders', o => o.userId === userId);
    if (previousOrders.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is valid only on your first order.'
      });
    }
  }

  db.update('carts', cart.id, { appliedCoupon: cleanCode });
  cart.appliedCoupon = cleanCode;
  const calculated = calculateCartTotals(cart);

  res.json({
    success: true,
    message: `Coupon ${coupon.code} applied successfully! You saved ₹${calculated.discountAmount}.`,
    data: calculated
  });
});

// Remove Coupon
router.delete('/remove-coupon', optionalAuth, (req, res) => {
  const userId = req.user ? req.user.id : null;
  const guestId = req.headers['x-guest-id'] || req.body.guestId;

  const cart = getCart(userId, guestId);
  db.update('carts', cart.id, { appliedCoupon: null });
  cart.appliedCoupon = null;
  const calculated = calculateCartTotals(cart);

  res.json({
    success: true,
    message: 'Coupon removed.',
    data: calculated
  });
});

// Clear Cart
router.delete('/clear', optionalAuth, (req, res) => {
  const userId = req.user ? req.user.id : null;
  const guestId = req.headers['x-guest-id'] || req.body.guestId;

  const cart = getCart(userId, guestId);
  db.update('carts', cart.id, { items: [], appliedCoupon: null });

  res.json({
    success: true,
    message: 'Cart cleared.'
  });
});

module.exports = router;
