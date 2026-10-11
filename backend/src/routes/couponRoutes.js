const express = require('express');
const router = express.Router();
const db = require('../db');

// Get active public promo codes
router.get('/active', (req, res) => {
  const coupons = db.find('coupons', c => c.isActive)
    .map(c => ({
      code: c.code,
      description: c.description,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderValue: c.minOrderValue,
      maxDiscountAmount: c.maxDiscountAmount,
      expiryDate: c.expiryDate
    }));

  res.json({ success: true, data: coupons });
});

// Validate coupon code against subtotal
router.post('/validate', (req, res) => {
  const { code, subtotal = 0 } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Please provide a coupon code.' });
  }

  const coupon = db.findOne('coupons', c => c.code === code.trim().toUpperCase() && c.isActive);
  if (!coupon) {
    return res.status(400).json({ success: false, message: 'Invalid or inactive coupon code.' });
  }

  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return res.status(400).json({
      success: false,
      message: `Minimum order value for ${coupon.code} is ₹${coupon.minOrderValue}. Add ₹${coupon.minOrderValue - subtotal} more to qualify.`
    });
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscountAmount) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }
  } else if (coupon.discountType === 'fixed') {
    discount = Math.min(coupon.discountValue, subtotal);
  } else if (coupon.discountType === 'shipping') {
    discount = 99; // Standard shipping waived
  }

  res.json({
    success: true,
    message: `Coupon ${coupon.code} is valid!`,
    data: {
      code: coupon.code,
      discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      description: coupon.description
    }
  });
});

module.exports = router;
