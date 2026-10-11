const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db');
const { optionalAuth, authenticateToken } = require('../middleware/auth');

function generateOrderNumber() {
  const dateStr = new Date().toISOString().slice(2, 7).replace('-', '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AURA-${dateStr}-${rand}`;
}

// Create new order (Atomic checkout with stock verification)
router.post('/checkout', optionalAuth, (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const {
      contact, // { name, email, phone }
      shippingAddress, // { fullName, phone, houseDetails, street, city, state, pinCode, country }
      deliveryMethod = 'Standard Express Delivery',
      paymentMethod, // 'UPI', 'CARD', 'NETBANKING', 'COD', 'RAZORPAY'
      couponCode,
      items // [{ productId, size, color, quantity }]
    } = req.body;

    // 1. Validate contact info
    if (!contact || !contact.name || !contact.email || !contact.phone) {
      return res.status(400).json({ success: false, message: 'Contact details (name, email, phone) are required.' });
    }

    // 2. Validate shipping address & PIN code
    if (!shippingAddress || !shippingAddress.houseDetails || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pinCode) {
      return res.status(400).json({ success: false, message: 'Complete delivery address is required.' });
    }
    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!pinRegex.test(shippingAddress.pinCode.toString().trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 6-digit Indian PIN code.' });
    }

    // 3. Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Shopping bag is empty.' });
    }

    // 4. Validate payment method
    const validPayments = ['UPI', 'Debit or Credit Card', 'Net Banking', 'Cash on Delivery', 'Razorpay Test Mode'];
    if (!paymentMethod) {
      return res.status(400).json({ success: false, message: 'Please select a valid payment method.' });
    }

    // Run atomic order creation and inventory deduction
    const order = db.transaction((tx) => {
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = tx.findById('products', item.productId);
        if (!product) {
          throw new Error(`Product ${item.productId} not found.`);
        }

        // Find variant and verify stock
        const variants = product.variants || [];
        const variantIndex = variants.findIndex(v => v.size === item.size && (!item.color || v.color === item.color));
        const variant = variantIndex > -1 ? variants[variantIndex] : null;

        if (variant) {
          if (variant.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name} (${item.size}, ${item.color || 'Standard'}). Only ${variant.stock} left.`);
          }
          // Deduct stock
          variant.stock -= item.quantity;
          variants[variantIndex] = variant;
          tx.update('products', product.id, { variants });
        }

        const price = product.price;
        subtotal += price * item.quantity;

        orderItems.push({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          size: item.size,
          color: item.color || (product.colors && product.colors[0] ? product.colors[0].name : 'Standard'),
          price,
          quantity: item.quantity,
          image: product.images && product.images[0]
        });
      }

      // Shipping & Coupon calculation
      const settings = tx.getContent().siteSettings || {};
      const threshold = settings.freeShippingThreshold || 999;
      let shippingFee = subtotal >= threshold ? 0 : (settings.standardShippingFee || 99);
      if (deliveryMethod.toLowerCase().includes('express')) {
        shippingFee = 199;
      }

      let discountAmount = 0;
      let appliedCouponCode = null;

      if (couponCode) {
        const cleanCode = couponCode.trim().toUpperCase();
        const coupon = tx.findOne('coupons', c => c.code === cleanCode && c.isActive);
        if (coupon && subtotal >= coupon.minOrderValue) {
          appliedCouponCode = cleanCode;
          if (coupon.discountType === 'shipping') {
            discountAmount = shippingFee;
            shippingFee = 0;
          } else if (coupon.discountType === 'percentage') {
            const disc = Math.round((subtotal * coupon.discountValue) / 100);
            discountAmount = coupon.maxDiscountAmount ? Math.min(disc, coupon.maxDiscountAmount) : disc;
          } else if (coupon.discountType === 'fixed') {
            discountAmount = Math.min(coupon.discountValue, subtotal);
          }
          // Increment coupon usage
          coupon.usageCount = (coupon.usageCount || 0) + 1;
        }
      }

      const taxAmount = Math.round((subtotal - discountAmount) * 0.05);
      const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

      const isCOD = paymentMethod === 'Cash on Delivery';
      const paymentStatus = isCOD ? 'Pending (COD)' : 'Completed';
      const initialStatus = isCOD ? 'Order Placed' : 'Payment Confirmed';

      const orderNumber = generateOrderNumber();
      const newOrder = tx.insert('orders', {
        orderNumber,
        userId: userId || null,
        guestEmail: !userId ? contact.email : null,
        contact,
        items: orderItems,
        subtotal,
        discountAmount,
        couponCode: appliedCouponCode,
        shippingFee,
        taxAmount,
        totalAmount,
        deliveryMethod,
        paymentMethod,
        paymentStatus,
        razorpayPaymentId: paymentMethod.toLowerCase().includes('razorpay') ? `pay_rzp_mock_${Date.now()}` : (isCOD ? null : `pay_tx_${crypto.randomBytes(4).toString('hex')}`),
        status: initialStatus,
        shippingAddress,
        trackingNumber: `AURA-AWB-${Math.floor(10000000 + Math.random() * 90000000)}`,
        trackingCarrier: 'Delhivery Express',
        estimatedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        statusHistory: [
          { status: 'Order Placed', timestamp: new Date().toISOString(), note: `Order placed via ${paymentMethod}` },
          ...(!isCOD ? [{ status: 'Payment Confirmed', timestamp: new Date().toISOString(), note: 'Payment verified and confirmed' }] : [])
        ]
      });

      // Clear customer cart if user was logged in
      if (userId) {
        const cart = tx.findOne('carts', c => c.userId === userId);
        if (cart) {
          tx.update('carts', cart.id, { items: [], appliedCoupon: null });
        }
      }

      return newOrder;
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: order
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get user orders (authenticated)
router.get('/my-orders', authenticateToken, (req, res) => {
  const orders = db.find('orders', o => o.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, data: orders });
});

// Get order details by orderNumber or ID (authenticated or with verification)
router.get('/:identifier', optionalAuth, (req, res) => {
  const { identifier } = req.params;
  const order = db.findOne('orders', o => o.id === identifier || o.orderNumber === identifier);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  // Security check: if user is logged in, ensure it belongs to them (or admin)
  if (req.user && req.user.role !== 'admin') {
    if (order.userId && order.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this order.' });
    }
  }

  res.json({ success: true, data: order });
});

// Public Track Order lookup
router.post('/track', (req, res) => {
  const { orderNumber, emailOrPhone } = req.body;

  if (!orderNumber || !emailOrPhone) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both your Order Number and registered Email or Phone number.'
    });
  }

  const cleanOrderNum = orderNumber.trim().toUpperCase();
  const cleanQuery = emailOrPhone.trim().toLowerCase();

  const order = db.findOne('orders', o =>
    (o.orderNumber && o.orderNumber.toUpperCase() === cleanOrderNum) ||
    (o.id && o.id.toUpperCase() === cleanOrderNum)
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'No order found matching this Order Number.'
    });
  }

  // Verification matching
  const emailMatch = (order.contact && order.contact.email && order.contact.email.toLowerCase() === cleanQuery) ||
    (order.guestEmail && order.guestEmail.toLowerCase() === cleanQuery);
  const phoneMatch = (order.contact && order.contact.phone && order.contact.phone.replace(/\D/g, '').includes(cleanQuery.replace(/\D/g, ''))) ||
    (order.shippingAddress && order.shippingAddress.phone && order.shippingAddress.phone.replace(/\D/g, '').includes(cleanQuery.replace(/\D/g, '')));

  if (!emailMatch && !phoneMatch) {
    return res.status(400).json({
      success: false,
      message: 'The email or phone number does not match this order.'
    });
  }

  res.json({
    success: true,
    data: {
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order.createdAt,
      deliveryMethod: order.deliveryMethod,
      trackingNumber: order.trackingNumber,
      trackingCarrier: order.trackingCarrier,
      estimatedDeliveryDate: order.estimatedDeliveryDate,
      statusHistory: order.statusHistory,
      items: order.items,
      totalAmount: order.totalAmount,
      shippingAddress: {
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        pinCode: order.shippingAddress.pinCode
      }
    }
  });
});

// Cancel Order (only eligible if not yet Shipped)
router.post('/:id/cancel', authenticateToken, (req, res) => {
  const order = db.findById('orders', req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized.' });
  }

  const cancellableStatuses = ['Order Placed', 'Payment Confirmed', 'Processing'];
  if (!cancellableStatuses.includes(order.status)) {
    return res.status(400).json({
      success: false,
      message: `Order cannot be cancelled in status: ${order.status}. Contact customer care for assistance.`
    });
  }

  const { reason = 'Cancelled by customer' } = req.body;

  // Restore inventory
  for (const item of order.items) {
    const product = db.findById('products', item.productId);
    if (product) {
      const variants = product.variants || [];
      const v = variants.find(vr => vr.size === item.size && (!item.color || vr.color === item.color));
      if (v) {
        v.stock += item.quantity;
        db.update('products', product.id, { variants });
      }
    }
  }

  const history = order.statusHistory || [];
  history.push({
    status: 'Cancelled',
    timestamp: new Date().toISOString(),
    note: reason
  });

  const updated = db.update('orders', order.id, {
    status: 'Cancelled',
    paymentStatus: order.paymentStatus === 'Completed' ? 'Refunded' : order.paymentStatus,
    statusHistory: history
  });

  res.json({
    success: true,
    message: 'Order cancelled successfully. Refund (if applicable) will be processed within 3-5 business days.',
    data: updated
  });
});

// Return / Exchange Request
router.post('/:id/return-request', authenticateToken, (req, res) => {
  const order = db.findById('orders', req.params.id);
  if (!order || order.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Order not found or unauthorized.' });
  }

  if (order.status !== 'Delivered') {
    return res.status(400).json({ success: false, message: 'Returns can only be requested for delivered orders.' });
  }

  const { type = 'return', reason, items } = req.body;
  if (!reason) {
    return res.status(400).json({ success: false, message: 'Please provide a reason for return/exchange.' });
  }

  const returnReq = db.insert('returns', {
    orderId: order.id,
    orderNumber: order.orderNumber,
    userId: req.user.id,
    type,
    reason,
    items: items || order.items,
    status: 'Pending Review'
  });

  const history = order.statusHistory || [];
  history.push({
    status: type === 'exchange' ? 'Exchange Requested' : 'Return Requested',
    timestamp: new Date().toISOString(),
    note: `${type.toUpperCase()}: ${reason}`
  });

  db.update('orders', order.id, {
    status: type === 'exchange' ? 'Exchange Requested' : 'Return Requested',
    statusHistory: history
  });

  res.json({
    success: true,
    message: `${type === 'exchange' ? 'Exchange' : 'Return'} request submitted. Our team will review and approve pickup within 24-48 hours.`,
    data: returnReq
  });
});

module.exports = router;
