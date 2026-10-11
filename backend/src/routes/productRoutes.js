const express = require('express');
const router = express.Router();
const db = require('../db');

// Live instant search suggestions
router.get('/search/suggestions', (req, res) => {
  const query = (req.query.q || '').trim().toLowerCase();
  if (!query) {
    return res.json({ success: true, suggestions: [], popularSearches: ['Parachute Cargo', 'Acid Wash Tee', 'Oversized Hoodie', 'Midi Slip Dress', 'Baby Tee'] });
  }

  const products = db.find('products');
  const categories = db.find('categories');

  // Search matching products
  const matchingProducts = products
    .filter(p =>
      p.name.toLowerCase().includes(query) ||
      (p.style && p.style.toLowerCase().includes(query)) ||
      (p.fabric && p.fabric.toLowerCase().includes(query)) ||
      p.description.toLowerCase().includes(query)
    )
    .slice(0, 6)
    .map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.images && p.images[0],
      style: p.style,
      gender: p.gender
    }));

  // Matching categories
  const matchingCategories = categories
    .filter(c => c.name.toLowerCase().includes(query))
    .slice(0, 3)
    .map(c => ({ id: c.id, name: c.name, slug: c.slug }));

  res.json({
    success: true,
    products: matchingProducts,
    categories: matchingCategories
  });
});

// List products with multi-filtering, sorting, and pagination
router.get('/', (req, res) => {
  let products = db.find('products');
  const {
    category,
    style,
    gender,
    minPrice,
    maxPrice,
    size,
    color,
    rating,
    discount,
    isNewArrival,
    isBestSeller,
    isTrending,
    isOnSale,
    search,
    sort,
    page = 1,
    limit = 12
  } = req.query;

  // Filter: Category
  if (category) {
    const cat = db.findOne('categories', c => c.slug === category || c.id === category);
    if (cat) {
      products = products.filter(p => p.categoryId === cat.id);
    }
  }

  // Filter: Style
  if (style) {
    const styleLower = style.toLowerCase();
    products = products.filter(p => p.style && p.style.toLowerCase() === styleLower);
  }

  // Filter: Gender
  if (gender) {
    const genderLower = gender.toLowerCase();
    products = products.filter(p => p.gender && (p.gender.toLowerCase() === genderLower || p.gender === 'Unisex'));
  }

  // Filter: Min Price
  if (minPrice) {
    const min = parseFloat(minPrice);
    if (!isNaN(min)) {
      products = products.filter(p => p.price >= min);
    }
  }

  // Filter: Max Price
  if (maxPrice) {
    const max = parseFloat(maxPrice);
    if (!isNaN(max)) {
      products = products.filter(p => p.price <= max);
    }
  }

  // Filter: Size
  if (size) {
    const sizeList = Array.isArray(size) ? size : size.split(',');
    products = products.filter(p => p.sizes && sizeList.some(s => p.sizes.includes(s.trim())));
  }

  // Filter: Color
  if (color) {
    const colorLower = color.toLowerCase();
    products = products.filter(p =>
      p.colors && p.colors.some(c => c.name.toLowerCase().includes(colorLower) || c.code.toLowerCase().includes(colorLower))
    );
  }

  // Filter: Rating
  if (rating) {
    const minRating = parseFloat(rating);
    if (!isNaN(minRating)) {
      products = products.filter(p => (p.ratingsAverage || 0) >= minRating);
    }
  }

  // Filter: Discount
  if (discount) {
    const minDiscount = parseFloat(discount);
    if (!isNaN(minDiscount)) {
      products = products.filter(p => (p.discountPercent || 0) >= minDiscount);
    }
  }

  // Filter: Flags
  if (isNewArrival === 'true') {
    products = products.filter(p => p.isNewArrival);
  }
  if (isBestSeller === 'true') {
    products = products.filter(p => p.isBestSeller);
  }
  if (isTrending === 'true') {
    products = products.filter(p => p.isTrending);
  }
  if (isOnSale === 'true') {
    products = products.filter(p => p.isOnSale || (p.discountPercent && p.discountPercent > 0));
  }

  // Search
  if (search) {
    const q = search.trim().toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.style && p.style.toLowerCase().includes(q)) ||
      (p.fabric && p.fabric.toLowerCase().includes(q))
    );
  }

  // Sorting
  switch (sort) {
    case 'newest':
      products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      break;
    case 'price-asc':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'best-seller':
      products.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || (b.ratingsCount || 0) - (a.ratingsCount || 0));
      break;
    case 'rating':
      products.sort((a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0));
      break;
    case 'discount':
      products.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
      break;
    case 'recommended':
    default:
      products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || (b.ratingsAverage || 0) - (a.ratingsAverage || 0));
      break;
  }

  const total = products.length;
  const p = parseInt(page) || 1;
  const l = parseInt(limit) || 12;
  const startIndex = (p - 1) * l;
  const paginated = products.slice(startIndex, startIndex + l);

  res.json({
    success: true,
    data: paginated,
    meta: {
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l)
    }
  });
});

// Get single product by ID or slug
router.get('/:identifier', (req, res) => {
  const { identifier } = req.params;
  const product = db.findOne('products', p => p.id === identifier || p.slug === identifier);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  const category = db.findById('categories', product.categoryId);
  const reviews = db.find('reviews', r => r.productId === product.id);

  // Get related products
  const related = db.find('products', p =>
    p.id !== product.id && (p.categoryId === product.categoryId || p.style === product.style)
  ).slice(0, 4);

  res.json({
    success: true,
    data: {
      ...product,
      category,
      reviews,
      related
    }
  });
});

// Related products
router.get('/:id/related', (req, res) => {
  const product = db.findById('products', req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  const related = db.find('products', p =>
    p.id !== product.id && (p.categoryId === product.categoryId || p.style === product.style)
  ).slice(0, 6);

  res.json({ success: true, data: related });
});

module.exports = router;
