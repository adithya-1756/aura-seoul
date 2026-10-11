const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Get all saved addresses for user
router.get('/', authenticateToken, (req, res) => {
  const addresses = db.find('addresses', a => a.userId === req.user.id);
  res.json({ success: true, data: addresses });
});

// Add new address
router.post('/', authenticateToken, (req, res) => {
  const {
    fullName,
    phone,
    houseDetails,
    street,
    city,
    state,
    pinCode,
    country = 'India',
    isDefault = false,
    deliveryInstructions = ''
  } = req.body;

  if (!fullName || !phone || !houseDetails || !city || !state || !pinCode) {
    return res.status(400).json({ success: false, message: 'Please fill in all required address fields.' });
  }

  // Validate Indian PIN Code (6 digits)
  const pinRegex = /^[1-9][0-9]{5}$/;
  if (!pinRegex.test(pinCode.trim())) {
    return res.status(400).json({ success: false, message: 'Please enter a valid 6-digit Indian PIN code.' });
  }

  // If set to default, clear previous default addresses for this user
  if (isDefault) {
    const existing = db.find('addresses', a => a.userId === req.user.id);
    existing.forEach(a => {
      if (a.isDefault) db.update('addresses', a.id, { isDefault: false });
    });
  }

  const newAddress = db.insert('addresses', {
    userId: req.user.id,
    fullName: fullName.trim(),
    phone: phone.trim(),
    houseDetails: houseDetails.trim(),
    street: street ? street.trim() : '',
    city: city.trim(),
    state: state.trim(),
    pinCode: pinCode.trim(),
    country: country.trim(),
    isDefault: Boolean(isDefault),
    deliveryInstructions: deliveryInstructions ? deliveryInstructions.trim() : ''
  });

  res.status(201).json({
    success: true,
    message: 'Delivery address saved successfully.',
    data: newAddress
  });
});

// Update address
router.put('/:id', authenticateToken, (req, res) => {
  const address = db.findById('addresses', req.params.id);
  if (!address || address.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Address not found or unauthorized.' });
  }

  const {
    fullName,
    phone,
    houseDetails,
    street,
    city,
    state,
    pinCode,
    country,
    isDefault,
    deliveryInstructions
  } = req.body;

  if (isDefault) {
    const existing = db.find('addresses', a => a.userId === req.user.id);
    existing.forEach(a => {
      if (a.id !== address.id && a.isDefault) db.update('addresses', a.id, { isDefault: false });
    });
  }

  const updated = db.update('addresses', address.id, {
    fullName: fullName ? fullName.trim() : address.fullName,
    phone: phone ? phone.trim() : address.phone,
    houseDetails: houseDetails ? houseDetails.trim() : address.houseDetails,
    street: street !== undefined ? street.trim() : address.street,
    city: city ? city.trim() : address.city,
    state: state ? state.trim() : address.state,
    pinCode: pinCode ? pinCode.trim() : address.pinCode,
    country: country ? country.trim() : address.country,
    isDefault: isDefault !== undefined ? Boolean(isDefault) : address.isDefault,
    deliveryInstructions: deliveryInstructions !== undefined ? deliveryInstructions.trim() : address.deliveryInstructions
  });

  res.json({
    success: true,
    message: 'Address updated.',
    data: updated
  });
});

// Set as default address
router.put('/:id/default', authenticateToken, (req, res) => {
  const address = db.findById('addresses', req.params.id);
  if (!address || address.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Address not found.' });
  }

  const existing = db.find('addresses', a => a.userId === req.user.id);
  existing.forEach(a => {
    db.update('addresses', a.id, { isDefault: a.id === address.id });
  });

  res.json({
    success: true,
    message: 'Set as default delivery address.'
  });
});

// Delete address
router.delete('/:id', authenticateToken, (req, res) => {
  const address = db.findById('addresses', req.params.id);
  if (!address || address.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Address not found.' });
  }

  db.delete('addresses', address.id);
  res.json({ success: true, message: 'Address deleted.' });
});

module.exports = router;
