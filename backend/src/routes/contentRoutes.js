const express = require('express');
const router = express.Router();
const db = require('../db');

// Get homepage & store configurations
router.get('/homepage', (req, res) => {
  const content = db.getContent();
  res.json({
    success: true,
    data: content
  });
});

// Newsletter subscription
router.post('/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const existing = db.findOne('subscribers', s => s.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.json({
      success: true,
      message: 'You are already subscribed to Aura Seoul drops & private sales!'
    });
  }

  db.insert('subscribers', {
    email: cleanEmail,
    subscribedAt: new Date().toISOString()
  });

  res.status(201).json({
    success: true,
    message: 'Welcome to the inner circle! You will receive early access to our upcoming drops.'
  });
});

module.exports = router;
