const bcrypt = require('bcryptjs');

function getInitialData() {
  const adminPasswordHash = bcrypt.hashSync('admin123', 10);
  const customerPasswordHash = bcrypt.hashSync('customer123', 10);

  const categories = [
    { id: 'cat-tops', name: 'Tops', slug: 'tops', description: 'Contemporary tops, everyday blouses, and structured silhouettes', image: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80', displayOrder: 1 },
    { id: 'cat-tshirts', name: 'T-Shirts', slug: 't-shirts', description: 'Oversized graphic tees, vintage washes, and minimal basics', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', displayOrder: 2 },
    { id: 'cat-shirts', name: 'Shirts', slug: 'shirts', description: 'Relaxed linen shirts, boxy button-downs, and poplin classics', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', displayOrder: 3 },
    { id: 'cat-croptops', name: 'Crop Tops', slug: 'crop-tops', description: 'Y2K baby tees, ribbed knits, and statement cut-out crops', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80', displayOrder: 4 },
    { id: 'cat-jeans', name: 'Jeans', slug: 'jeans', description: 'Baggy raw denim, vintage faded washes, and relaxed straight fits', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80', displayOrder: 5 },
    { id: 'cat-pants', name: 'Pants & Trousers', slug: 'pants-and-trousers', description: 'Tailored pleated slacks, minimal trousers, and everyday chinos', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80', displayOrder: 6 },
    { id: 'cat-cargo', name: 'Cargo Pants', slug: 'cargo-pants', description: 'Utilitarian multi-pocket cargos with adjustable parachute toggles', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80', displayOrder: 7 },
    { id: 'cat-wideleg', name: 'Wide-Leg Pants', slug: 'wide-leg-pants', description: 'Flowy drape palazzo and high-waist architectural wide legs', image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80', displayOrder: 8 },
    { id: 'cat-skirts', name: 'Skirts', slug: 'skirts', description: 'Pleated mini tennis skirts, cargo maxis, and satin slip skirts', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80', displayOrder: 9 },
    { id: 'cat-dresses', name: 'Dresses', slug: 'dresses', description: 'Modern shift dresses, Y2K ruched bodycons, and layered slip dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80', displayOrder: 10 },
    { id: 'cat-kurtis', name: 'Kurtis', slug: 'kurtis', description: 'Contemporary indie fusion kurtis, minimal handblock prints', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', displayOrder: 11 },
    { id: 'cat-ethnic', name: 'Ethnic Wear', slug: 'ethnic-wear', description: 'Modern traditional co-ords, fusion tunics, and festive elegance', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', displayOrder: 12 },
    { id: 'cat-hoodies', name: 'Hoodies & Sweatshirts', slug: 'hoodies-and-sweatshirts', description: 'Heavyweight french terry hoodies, oversized boxy fleece crewnecks', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80', displayOrder: 13 },
    { id: 'cat-jackets', name: 'Jackets', slug: 'jackets', description: 'Structured cropped bombers, leather moto jackets, and oversized blazers', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80', displayOrder: 14 },
    { id: 'cat-coord', name: 'Co-ord Sets', slug: 'co-ord-sets', description: 'Monochrome knit combos, tailored blazer-shorts sets, and loungewear', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', displayOrder: 15 },
    { id: 'cat-shorts', name: 'Shorts', slug: 'shorts', description: 'Relaxed sweat shorts, pleated tailored Bermuda shorts, and denim cutoffs', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80', displayOrder: 16 },
    { id: 'cat-accessories', name: 'Accessories', slug: 'accessories', description: 'Crossbody tech bags, beanies, minimal metal jewelry, and caps', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80', displayOrder: 17 }
  ];

  const products = [
    {
      id: 'prod-001',
      name: 'Seoul Overdrive Acid Wash Graphic Tee',
      slug: 'seoul-overdrive-acid-wash-graphic-tee',
      description: 'Engineered with premium 260 GSM combed cotton. Features custom cyber-hangul typography screenprinted on front and back, drop-shoulder seams, and vintage enzyme acid wash finish.',
      shortDescription: 'Heavyweight 260 GSM drop-shoulder tee with Korean streetwear graphic.',
      price: 1299,
      originalPrice: 1999,
      discountPercent: 35,
      categoryId: 'cat-tshirts',
      style: 'Korean Streetwear',
      gender: 'Unisex',
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      isFeatured: true,
      isOnSale: true,
      fabric: '100% Combed Heavy Cotton (260 GSM)',
      fit: 'Oversized Boxy Silhouette',
      careInstructions: 'Machine wash cold inside out. Do not tumble dry. Low iron on reverse.',
      ratingsAverage: 4.8,
      ratingsCount: 42,
      images: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Charcoal Acid Wash', hex: '#2B2B2B', code: 'charcoal' },
        { name: 'Vintage Washed Black', hex: '#1C1C1C', code: 'black' },
        { name: 'Oatmeal Heather', hex: '#E6E2DD', code: 'oatmeal' }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      variants: [
        { size: 'S', color: 'Charcoal Acid Wash', stock: 15, sku: 'SEOUL-TEE-CHA-S' },
        { size: 'M', color: 'Charcoal Acid Wash', stock: 24, sku: 'SEOUL-TEE-CHA-M' },
        { size: 'L', color: 'Charcoal Acid Wash', stock: 18, sku: 'SEOUL-TEE-CHA-L' },
        { size: 'XL', color: 'Charcoal Acid Wash', stock: 10, sku: 'SEOUL-TEE-CHA-XL' },
        { size: 'XXL', color: 'Charcoal Acid Wash', stock: 5, sku: 'SEOUL-TEE-CHA-XXL' },
        { size: 'M', color: 'Vintage Washed Black', stock: 20, sku: 'SEOUL-TEE-BLK-M' },
        { size: 'L', color: 'Vintage Washed Black', stock: 12, sku: 'SEOUL-TEE-BLK-L' },
        { size: 'M', color: 'Oatmeal Heather', stock: 14, sku: 'SEOUL-TEE-OAT-M' }
      ]
    },
    {
      id: 'prod-002',
      name: 'Cyber Y2K Parachute Cargo Pants',
      slug: 'cyber-y2k-parachute-cargo-pants',
      description: 'Technical parachute poplin cargo pants inspired by Harajuku & Seoul subcultures. Features articulated knee darts, 6 functional cargo flap pockets, and adjustable bungee toggles at the hems.',
      shortDescription: 'Bungee toggle hem parachute cargos with deep flap utility pockets.',
      price: 2499,
      originalPrice: 3499,
      discountPercent: 28,
      categoryId: 'cat-cargo',
      style: 'Y2K Fashion',
      gender: 'Unisex',
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      isFeatured: true,
      isOnSale: true,
      fabric: '100% Lightweight Technical Nylon Poplin',
      fit: 'Relaxed Balloon Fit with Cinchable Ankle Toggles',
      careInstructions: 'Machine wash cold on gentle cycle. Hang to dry in shade.',
      ratingsAverage: 4.9,
      ratingsCount: 58,
      images: [
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Military Sage Green', hex: '#4A5B4E', code: 'sage' },
        { name: 'Matte Obsidian Black', hex: '#121212', code: 'black' },
        { name: 'Chalk Stone Grey', hex: '#D6D2CB', code: 'stone' }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      variants: [
        { size: 'S', color: 'Military Sage Green', stock: 12, sku: 'CARGO-SAGE-S' },
        { size: 'M', color: 'Military Sage Green', stock: 20, sku: 'CARGO-SAGE-M' },
        { size: 'L', color: 'Military Sage Green', stock: 15, sku: 'CARGO-SAGE-L' },
        { size: 'XL', color: 'Military Sage Green', stock: 8, sku: 'CARGO-SAGE-XL' },
        { size: 'M', color: 'Matte Obsidian Black', stock: 18, sku: 'CARGO-BLK-M' },
        { size: 'L', color: 'Matte Obsidian Black', stock: 14, sku: 'CARGO-BLK-L' }
      ]
    },
    {
      id: 'prod-003',
      name: 'Hongdae Heavyweight Boxy Zip Hoodie',
      slug: 'hongdae-heavyweight-boxy-zip-hoodie',
      description: 'Crafted from 420 GSM diagonal loopback French Terry. Features custom two-way brushed metal zipper, double-layered hood without drawstrings for clean aesthetic, and dropped shoulders.',
      shortDescription: '420 GSM luxury fleece hoodie with custom two-way metal zipper.',
      price: 2999,
      originalPrice: 3999,
      discountPercent: 25,
      categoryId: 'cat-hoodies',
      style: 'Korean Streetwear',
      gender: 'Unisex',
      isNewArrival: false,
      isBestSeller: true,
      isTrending: true,
      isFeatured: true,
      isOnSale: false,
      fabric: '100% French Terry Cotton (420 GSM)',
      fit: 'Oversized Boxy Drop-Shoulder',
      careInstructions: 'Machine wash delicate cold. Reshape and flat dry.',
      ratingsAverage: 4.9,
      ratingsCount: 84,
      images: [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Oat Milk Cream', hex: '#F0ECE1', code: 'cream' },
        { name: 'Washed Ash Black', hex: '#222222', code: 'ash' },
        { name: 'Dusted Cobalt', hex: '#3B4D61', code: 'cobalt' }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      variants: [
        { size: 'S', color: 'Oat Milk Cream', stock: 10, sku: 'ZIP-CRM-S' },
        { size: 'M', color: 'Oat Milk Cream', stock: 16, sku: 'ZIP-CRM-M' },
        { size: 'L', color: 'Oat Milk Cream', stock: 22, sku: 'ZIP-CRM-L' },
        { size: 'XL', color: 'Oat Milk Cream', stock: 9, sku: 'ZIP-CRM-XL' },
        { size: 'M', color: 'Washed Ash Black', stock: 19, sku: 'ZIP-ASH-M' },
        { size: 'L', color: 'Washed Ash Black', stock: 25, sku: 'ZIP-ASH-L' }
      ]
    },
    {
      id: 'prod-004',
      name: 'Atelier Tailored Wide-Leg Pleated Trousers',
      slug: 'atelier-tailored-wide-leg-pleated-trousers',
      description: 'Sophisticated relaxed tailoring featuring double reverse pleats, extended tab waistband, and a fluid cascading wide-leg drape. Perfect for minimal elevated day-to-night styling.',
      shortDescription: 'Double front pleat trousers with fluid draping wide leg profile.',
      price: 2199,
      originalPrice: 2899,
      discountPercent: 24,
      categoryId: 'cat-wideleg',
      style: 'Minimalist Style',
      gender: 'Women',
      isNewArrival: true,
      isBestSeller: true,
      isTrending: false,
      isFeatured: true,
      isOnSale: true,
      fabric: 'Rayon & Poly Viscose Blend with Spandex Stretch',
      fit: 'High-Rise Relaxed Wide Leg',
      careInstructions: 'Dry clean recommended or gentle hand wash.',
      ratingsAverage: 4.7,
      ratingsCount: 33,
      images: [
        'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Warm Taupe Sand', hex: '#B8A693', code: 'taupe' },
        { name: 'Deep Espresso', hex: '#362B28', code: 'espresso' },
        { name: 'Classic Black', hex: '#0F0F0F', code: 'black' }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      variants: [
        { size: 'XS', color: 'Warm Taupe Sand', stock: 8, sku: 'TROUSER-TAU-XS' },
        { size: 'S', color: 'Warm Taupe Sand', stock: 15, sku: 'TROUSER-TAU-S' },
        { size: 'M', color: 'Warm Taupe Sand', stock: 18, sku: 'TROUSER-TAU-M' },
        { size: 'L', color: 'Warm Taupe Sand', stock: 12, sku: 'TROUSER-TAU-L' },
        { size: 'M', color: 'Classic Black', stock: 20, sku: 'TROUSER-BLK-M' }
      ]
    },
    {
      id: 'prod-005',
      name: 'Y2K Metallic Starlight Ribbed Baby Tee',
      slug: 'y2k-metallic-starlight-ribbed-baby-tee',
      description: 'Y2K aesthetic fitted baby tee in fine 2x2 ribbed cotton with holographic metallic rhinestone star motif. Contrast binding on collar and baby lettuce-edge hem trim.',
      shortDescription: 'Rhinestone starlight graphic baby tee with lettuce hem trim.',
      price: 899,
      originalPrice: 1399,
      discountPercent: 35,
      categoryId: 'cat-croptops',
      style: 'Y2K Fashion',
      gender: 'Women',
      isNewArrival: true,
      isBestSeller: false,
      isTrending: true,
      isFeatured: true,
      isOnSale: true,
      fabric: '95% Fine Cotton Rib, 5% Spandex',
      fit: 'Cropped Body-Conscious Fit',
      careInstructions: 'Hand wash cold inside out to protect rhinestones.',
      ratingsAverage: 4.6,
      ratingsCount: 29,
      images: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Baby Pink Ice', hex: '#F7C6D9', code: 'pink' },
        { name: 'Optical White', hex: '#FFFFFF', code: 'white' },
        { name: 'Midnight Charcoal', hex: '#232323', code: 'charcoal' }
      ],
      sizes: ['XS', 'S', 'M', 'L'],
      variants: [
        { size: 'XS', color: 'Baby Pink Ice', stock: 10, sku: 'BABY-PNK-XS' },
        { size: 'S', color: 'Baby Pink Ice', stock: 14, sku: 'BABY-PNK-S' },
        { size: 'M', color: 'Baby Pink Ice', stock: 12, sku: 'BABY-PNK-M' },
        { size: 'S', color: 'Optical White', stock: 18, sku: 'BABY-WHT-S' },
        { size: 'M', color: 'Optical White', stock: 15, sku: 'BABY-WHT-M' }
      ]
    },
    {
      id: 'prod-006',
      name: 'Namsan Distressed Wide Baggy Skate Jeans',
      slug: 'namsan-distressed-wide-baggy-skate-jeans',
      description: 'Heavyweight 14oz non-stretch denim treated with vintage stone-wash whiskers and knee distressing. Features deep pockets, reinforced back yoke, and wide straight leg cut that pools over sneakers.',
      shortDescription: '14oz vintage stonewashed 90s baggy skate denim jeans.',
      price: 2799,
      originalPrice: 3799,
      discountPercent: 26,
      categoryId: 'cat-jeans',
      style: 'Korean Streetwear',
      gender: 'Unisex',
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      isFeatured: true,
      isOnSale: false,
      fabric: '100% Rigid Heavy Cotton Denim (14oz)',
      fit: 'Relaxed Baggy Skate Fit',
      careInstructions: 'Turn inside out. Wash cold with like colors.',
      ratingsAverage: 4.9,
      ratingsCount: 65,
      images: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Vintage Washed Light Indigo', hex: '#7E9BB8', code: 'light-blue' },
        { name: 'Smoky Faded Grey', hex: '#5E6166', code: 'grey' }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      variants: [
        { size: 'S', color: 'Vintage Washed Light Indigo', stock: 11, sku: 'JEAN-VNT-S' },
        { size: 'M', color: 'Vintage Washed Light Indigo', stock: 22, sku: 'JEAN-VNT-M' },
        { size: 'L', color: 'Vintage Washed Light Indigo', stock: 19, sku: 'JEAN-VNT-L' },
        { size: 'XL', color: 'Vintage Washed Light Indigo', stock: 8, sku: 'JEAN-VNT-XL' }
      ]
    },
    {
      id: 'prod-007',
      name: 'Nocturne Asymmetric Ruched Midi Slip Dress',
      slug: 'nocturne-asymmetric-ruched-midi-slip-dress',
      description: 'Sculptural bias-cut liquid satin dress with delicate adjustable spaghetti straps, side ruching with functional drawstring for customizable length, and an asymmetric diagonal hemline.',
      shortDescription: 'Liquid satin bias-cut midi dress with adjustable side cinch ruching.',
      price: 2699,
      originalPrice: 3499,
      discountPercent: 22,
      categoryId: 'cat-dresses',
      style: 'Party Wear',
      gender: 'Women',
      isNewArrival: true,
      isBestSeller: false,
      isTrending: true,
      isFeatured: true,
      isOnSale: true,
      fabric: 'Silk-Touch Poly Satin with Natural Stretch',
      fit: 'Bias Cut Slim Drape',
      careInstructions: 'Hand wash cold or dry clean. Low steam iron.',
      ratingsAverage: 4.8,
      ratingsCount: 37,
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Champagne Gold', hex: '#D4AF37', code: 'gold' },
        { name: 'Noir Onyx', hex: '#111111', code: 'black' },
        { name: 'Bordeaux Crimson', hex: '#631B2B', code: 'crimson' }
      ],
      sizes: ['XS', 'S', 'M', 'L'],
      variants: [
        { size: 'XS', color: 'Champagne Gold', stock: 7, sku: 'DRESS-GLD-XS' },
        { size: 'S', color: 'Champagne Gold', stock: 14, sku: 'DRESS-GLD-S' },
        { size: 'M', color: 'Champagne Gold', stock: 12, sku: 'DRESS-GLD-M' },
        { size: 'S', color: 'Noir Onyx', stock: 16, sku: 'DRESS-BLK-S' },
        { size: 'M', color: 'Noir Onyx', stock: 15, sku: 'DRESS-BLK-M' }
      ]
    },
    {
      id: 'prod-008',
      name: 'Kyoto Raw Edge Minimalist Linen Button-Down',
      slug: 'kyoto-raw-edge-minimalist-linen-button-down',
      description: 'Relaxed airy camp-collar shirt woven from pure European flax linen. Features mother-of-pearl buttons, clean minimal French seams, and subtle chest pocket with pen slot.',
      shortDescription: '100% pure breathable French flax linen camp-collar shirt.',
      price: 1899,
      originalPrice: 2499,
      discountPercent: 24,
      categoryId: 'cat-shirts',
      style: 'Minimalist Style',
      gender: 'Men',
      isNewArrival: false,
      isBestSeller: true,
      isTrending: false,
      isFeatured: true,
      isOnSale: false,
      fabric: '100% Pure Woven Linen',
      fit: 'Relaxed Resort Fit',
      careInstructions: 'Gentle cycle cold. Line dry in shade.',
      ratingsAverage: 4.7,
      ratingsCount: 41,
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Raw Natural Ecru', hex: '#F3EFE0', code: 'ecru' },
        { name: 'Dusted Olive', hex: '#646F58', code: 'olive' },
        { name: 'Sky Chambray', hex: '#8BA4B8', code: 'chambray' }
      ],
      sizes: ['M', 'L', 'XL', 'XXL'],
      variants: [
        { size: 'M', color: 'Raw Natural Ecru', stock: 16, sku: 'SHIRT-ECR-M' },
        { size: 'L', color: 'Raw Natural Ecru', stock: 20, sku: 'SHIRT-ECR-L' },
        { size: 'XL', color: 'Raw Natural Ecru', stock: 14, sku: 'SHIRT-ECR-XL' }
      ]
    },
    {
      id: 'prod-009',
      name: 'Indie Fusion Handblock Chanderi Kurti',
      slug: 'indie-fusion-handblock-chanderi-kurti',
      description: 'Contemporary straight-cut fusion kurti handcrafted with authentic Bagru mud-resist handblock printing on breathable Chanderi cotton-silk. Features mandarin split collar and shell button placket.',
      shortDescription: 'Handcrafted authentic Chanderi fusion kurti with split collar.',
      price: 1799,
      originalPrice: 2599,
      discountPercent: 30,
      categoryId: 'cat-kurtis',
      style: 'Ethnic and Traditional Wear',
      gender: 'Women',
      isNewArrival: true,
      isBestSeller: true,
      isTrending: false,
      isFeatured: true,
      isOnSale: true,
      fabric: 'Chanderi Silk Cotton Blend',
      fit: 'Straight Relaxed Fit with Side Slits',
      careInstructions: 'Dry clean first wash. Gentle cold hand wash thereafter.',
      ratingsAverage: 4.8,
      ratingsCount: 49,
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Indigo Ajrakh Navy', hex: '#1E2D4A', code: 'navy' },
        { name: 'Terracotta Rust', hex: '#A34F36', code: 'rust' }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      variants: [
        { size: 'S', color: 'Indigo Ajrakh Navy', stock: 10, sku: 'KURTI-IND-S' },
        { size: 'M', color: 'Indigo Ajrakh Navy', stock: 18, sku: 'KURTI-IND-M' },
        { size: 'L', color: 'Indigo Ajrakh Navy', stock: 15, sku: 'KURTI-IND-L' },
        { size: 'XL', color: 'Indigo Ajrakh Navy', stock: 12, sku: 'KURTI-IND-XL' }
      ]
    },
    {
      id: 'prod-010',
      name: 'Cyberpunk Matrix Faux Leather Bomber',
      slug: 'cyberpunk-matrix-faux-leather-bomber',
      description: 'Futuristic cropped biker bomber crafted in matte vegan PU leather with custom gunmetal zip pulls, quilted sleeve paneling, stand ribbed collar, and padded insulating satin interior.',
      shortDescription: 'Matte vegan PU leather cropped bomber with gunmetal hardware.',
      price: 3699,
      originalPrice: 4999,
      discountPercent: 26,
      categoryId: 'cat-jackets',
      style: 'Korean Streetwear',
      gender: 'Unisex',
      isNewArrival: true,
      isBestSeller: false,
      isTrending: true,
      isFeatured: true,
      isOnSale: false,
      fabric: '100% Premium Eco Vegan PU Leather',
      fit: 'Cropped Structured Silhouette',
      careInstructions: 'Wipe clean with damp cloth. Do not iron directly.',
      ratingsAverage: 4.9,
      ratingsCount: 22,
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Obsidian Jet Black', hex: '#0A0A0A', code: 'black' },
        { name: 'Cognac Espresso', hex: '#4A2E1B', code: 'brown' }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      variants: [
        { size: 'S', color: 'Obsidian Jet Black', stock: 8, sku: 'BOMBER-BLK-S' },
        { size: 'M', color: 'Obsidian Jet Black', stock: 15, sku: 'BOMBER-BLK-M' },
        { size: 'L', color: 'Obsidian Jet Black', stock: 11, sku: 'BOMBER-BLK-L' },
        { size: 'XL', color: 'Obsidian Jet Black', stock: 6, sku: 'BOMBER-BLK-XL' }
      ]
    },
    {
      id: 'prod-011',
      name: 'Minimalist Waffle Knit Lounge Co-ord Set',
      slug: 'minimalist-waffle-knit-lounge-co-ord-set',
      description: 'Two-piece matching set featuring an oversized drop-shoulder pullover and high-waisted elasticated wide-leg pants in plush organic thermal waffle knit.',
      shortDescription: 'Two-piece textured thermal waffle knit pullover and relaxed pants set.',
      price: 2499,
      originalPrice: 3299,
      discountPercent: 24,
      categoryId: 'cat-coord',
      style: 'Casual Everyday Wear',
      gender: 'Women',
      isNewArrival: false,
      isBestSeller: true,
      isTrending: false,
      isFeatured: true,
      isOnSale: false,
      fabric: '95% Organic Cotton, 5% Elastane Waffle Weave',
      fit: 'Relaxed Slouchy Fit',
      careInstructions: 'Machine wash cold gentle. Lay flat to dry.',
      ratingsAverage: 4.7,
      ratingsCount: 51,
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Sand Dune Beige', hex: '#D8CAB8', code: 'sand' },
        { name: 'Muted Forest Olive', hex: '#586352', code: 'olive' }
      ],
      sizes: ['XS', 'S', 'M', 'L'],
      variants: [
        { size: 'XS', color: 'Sand Dune Beige', stock: 9, sku: 'COORD-SND-XS' },
        { size: 'S', color: 'Sand Dune Beige', stock: 17, sku: 'COORD-SND-S' },
        { size: 'M', color: 'Sand Dune Beige', stock: 19, sku: 'COORD-SND-M' },
        { size: 'L', color: 'Sand Dune Beige', stock: 12, sku: 'COORD-SND-L' }
      ]
    },
    {
      id: 'prod-012',
      name: 'K-Pop High-Waist Pleated Tennis Mini Skirt',
      slug: 'k-pop-high-waist-pleated-tennis-mini-skirt',
      description: 'Iconic Korean streetwear schoolgirl-inspired mini skirt with razor-sharp knife pleats, invisible side zipper closure, and built-in matching safety shorts underneath.',
      shortDescription: 'High-waist razor knife pleated mini skirt with built-in safety shorts.',
      price: 1199,
      originalPrice: 1699,
      discountPercent: 29,
      categoryId: 'cat-skirts',
      style: 'College Fits',
      gender: 'Women',
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      isFeatured: true,
      isOnSale: true,
      fabric: 'Structured Twill Suiting (Polyester/Rayon)',
      fit: 'A-Line High-Rise Mini',
      careInstructions: 'Hand wash cold or gentle machine cycle. Iron pleats on low.',
      ratingsAverage: 4.8,
      ratingsCount: 76,
      images: [
        'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Chalk White', hex: '#FAF9F6', code: 'white' },
        { name: 'Midnight Navy', hex: '#151D2A', code: 'navy' },
        { name: 'Graphite Grey', hex: '#474747', code: 'grey' }
      ],
      sizes: ['XS', 'S', 'M', 'L'],
      variants: [
        { size: 'XS', color: 'Chalk White', stock: 12, sku: 'SKIRT-WHT-XS' },
        { size: 'S', color: 'Chalk White', stock: 25, sku: 'SKIRT-WHT-S' },
        { size: 'M', color: 'Chalk White', stock: 20, sku: 'SKIRT-WHT-M' },
        { size: 'S', color: 'Midnight Navy', stock: 18, sku: 'SKIRT-NVY-S' }
      ]
    },
    {
      id: 'prod-013',
      name: 'Urban Transit Sling Crossbody Tactical Bag',
      slug: 'urban-transit-sling-crossbody-tactical-bag',
      description: 'Weatherproof ripstop Cordura nylon sling pack with Fidlock-style quick-release magnetic buckle, water-resistant taped zippers, and modular molle attachment webbing.',
      shortDescription: 'Water-resistant ripstop sling bag with quick-release tactical buckle.',
      price: 1499,
      originalPrice: 1999,
      discountPercent: 25,
      categoryId: 'cat-accessories',
      style: 'Korean Streetwear',
      gender: 'Unisex',
      isNewArrival: false,
      isBestSeller: true,
      isTrending: true,
      isFeatured: true,
      isOnSale: false,
      fabric: '500D Waterproof Cordura Ripstop Nylon',
      fit: 'One Size Adjustable Ergonomic Strap',
      careInstructions: 'Spot clean with mild soap and water.',
      ratingsAverage: 4.9,
      ratingsCount: 92,
      images: [
        'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Matte Stealth Black', hex: '#111111', code: 'black' },
        { name: 'Concrete Grey', hex: '#7A7A7A', code: 'grey' }
      ],
      sizes: ['Free Size'],
      variants: [
        { size: 'Free Size', color: 'Matte Stealth Black', stock: 35, sku: 'SLING-BLK-FS' },
        { size: 'Free Size', color: 'Concrete Grey', stock: 20, sku: 'SLING-GRY-FS' }
      ]
    },
    {
      id: 'prod-014',
      name: 'Athleisure Studio Seamless Compression Rib Leggings & Bra',
      slug: 'athleisure-studio-seamless-compression-rib-set',
      description: 'Ultra-sculpting 4-way stretch ribbed activewear set. High-waisted tummy compression waistband with squat-proof weave and removable padded scoop neck sports bra.',
      shortDescription: 'Sculpting 4-way stretch squat-proof seamless compression ribbed set.',
      price: 2199,
      originalPrice: 2999,
      discountPercent: 27,
      categoryId: 'cat-coord',
      style: 'Athleisure',
      gender: 'Women',
      isNewArrival: true,
      isBestSeller: false,
      isTrending: true,
      isFeatured: false,
      isOnSale: true,
      fabric: '80% Recycled Nylon, 20% Spandex',
      fit: 'High-Compression Contoured Fit',
      careInstructions: 'Machine wash cold. Do not use fabric softener.',
      ratingsAverage: 4.8,
      ratingsCount: 31,
      images: [
        'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Matcha Sage', hex: '#879F84', code: 'sage' },
        { name: 'Onyx Black', hex: '#1A1A1A', code: 'black' }
      ],
      sizes: ['XS', 'S', 'M', 'L'],
      variants: [
        { size: 'XS', color: 'Matcha Sage', stock: 8, sku: 'ATH-SGE-XS' },
        { size: 'S', color: 'Matcha Sage', stock: 15, sku: 'ATH-SGE-S' },
        { size: 'M', color: 'Matcha Sage', stock: 12, sku: 'ATH-SGE-M' }
      ]
    },
    {
      id: 'prod-015',
      name: 'University Varsity Fleece Terry Shorts',
      slug: 'university-varsity-fleece-terry-shorts',
      description: 'Heavyweight 360 GSM cotton fleece shorts with vintage collegiate arched embroidery on thigh, deep jersey pockets, thick ribbed elastic waistband with flat braided drawstrings.',
      shortDescription: '360 GSM heavyweight vintage collegiate sweat shorts.',
      price: 1199,
      originalPrice: 1599,
      discountPercent: 25,
      categoryId: 'cat-shorts',
      style: 'College Fits',
      gender: 'Unisex',
      isNewArrival: false,
      isBestSeller: false,
      isTrending: true,
      isFeatured: false,
      isOnSale: true,
      fabric: '100% Ring-Spun Cotton French Terry',
      fit: 'Relaxed Above-the-Knee Fit',
      careInstructions: 'Wash cold inside out. Tumble dry low.',
      ratingsAverage: 4.6,
      ratingsCount: 27,
      images: [
        'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Heather Ath Grey', hex: '#C2C4C6', code: 'grey' },
        { name: 'Vintage Forest Green', hex: '#223826', code: 'green' }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      variants: [
        { size: 'S', color: 'Heather Ath Grey', stock: 14, sku: 'SHRT-GRY-S' },
        { size: 'M', color: 'Heather Ath Grey', stock: 22, sku: 'SHRT-GRY-M' },
        { size: 'L', color: 'Heather Ath Grey', stock: 18, sku: 'SHRT-GRY-L' }
      ]
    },
    {
      id: 'prod-016',
      name: 'Chanderi Zari Handwoven Anarkali Set',
      slug: 'chanderi-zari-handwoven-anarkali-set',
      description: 'Exquisite three-piece festive ethnic ensemble comprising a flared Chanderi silk Anarkali kurta with delicate metallic zari border embroidery, matching trousers, and sheer organza dupatta.',
      shortDescription: 'Three-piece handwoven Chanderi festive ensemble with organza dupatta.',
      price: 4499,
      originalPrice: 5999,
      discountPercent: 25,
      categoryId: 'cat-ethnic',
      style: 'Ethnic and Traditional Wear',
      gender: 'Women',
      isNewArrival: true,
      isBestSeller: true,
      isTrending: false,
      isFeatured: true,
      isOnSale: true,
      fabric: 'Handwoven Chanderi Silk with Cotton Lining',
      fit: 'Flared Kalidar Silhouette',
      careInstructions: 'Dry clean only. Store wrapped in muslin cloth.',
      ratingsAverage: 4.9,
      ratingsCount: 44,
      images: [
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Royal Emerald Green', hex: '#0B4D3C', code: 'emerald' },
        { name: 'Dusty Rose Pink', hex: '#C48A96', code: 'rose' }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      variants: [
        { size: 'S', color: 'Royal Emerald Green', stock: 6, sku: 'ETH-EMR-S' },
        { size: 'M', color: 'Royal Emerald Green', stock: 10, sku: 'ETH-EMR-M' },
        { size: 'L', color: 'Royal Emerald Green', stock: 8, sku: 'ETH-EMR-L' }
      ]
    },
    {
      id: 'prod-017',
      name: 'Cyber Rave Metallic Corset Crop Top',
      slug: 'cyber-rave-metallic-corset-crop-top',
      description: 'Structured curved boning crop top in liquid iridescent sheen fabric. Features lace-up back with metal eyelets, sweetheart neckline, and contoured underbust support.',
      shortDescription: 'Liquid iridescent sheen structured boned corset top with lace-up back.',
      price: 1399,
      originalPrice: 1999,
      discountPercent: 30,
      categoryId: 'cat-croptops',
      style: 'Y2K Fashion',
      gender: 'Women',
      isNewArrival: false,
      isBestSeller: false,
      isTrending: true,
      isFeatured: false,
      isOnSale: true,
      fabric: 'Poly Lamé with Flexible Internal Boning',
      fit: 'Structured Contoured Corset Fit',
      careInstructions: 'Dry clean or wipe clean only.',
      ratingsAverage: 4.5,
      ratingsCount: 19,
      images: [
        'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Silver Holographic', hex: '#C0C0C0', code: 'silver' },
        { name: 'Cyber Purple', hex: '#6A0DAD', code: 'purple' }
      ],
      sizes: ['XS', 'S', 'M', 'L'],
      variants: [
        { size: 'XS', color: 'Silver Holographic', stock: 5, sku: 'CORSET-SLV-XS' },
        { size: 'S', color: 'Silver Holographic', stock: 12, sku: 'CORSET-SLV-S' },
        { size: 'M', color: 'Silver Holographic', stock: 9, sku: 'CORSET-SLV-M' }
      ]
    },
    {
      id: 'prod-018',
      name: 'Gangnam Double-Breasted Oversized Wool Blazer',
      slug: 'gangnam-double-breasted-oversized-wool-blazer',
      description: 'Tailored oversized blazer in premium brushed wool melange. Features strong structured shoulder pads, peak lapels, tortoise-shell horn buttons, and internal phone pocket.',
      shortDescription: 'Brushed wool melange double-breasted power blazer.',
      price: 3999,
      originalPrice: 5499,
      discountPercent: 27,
      categoryId: 'cat-jackets',
      style: 'Minimalist Style',
      gender: 'Unisex',
      isNewArrival: true,
      isBestSeller: true,
      isTrending: false,
      isFeatured: true,
      isOnSale: false,
      fabric: '60% Brushed Wool Melange, 40% Viscose Lining',
      fit: 'Relaxed Power Shoulder Oversized',
      careInstructions: 'Dry clean only.',
      ratingsAverage: 4.9,
      ratingsCount: 38,
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=1000&q=80'
      ],
      colors: [
        { name: 'Melange Coffee Tweed', hex: '#4E3E34', code: 'coffee' },
        { name: 'Midnight Charcoal', hex: '#1C1D21', code: 'charcoal' }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      variants: [
        { size: 'S', color: 'Melange Coffee Tweed', stock: 7, sku: 'BLAZER-COF-S' },
        { size: 'M', color: 'Melange Coffee Tweed', stock: 14, sku: 'BLAZER-COF-M' },
        { size: 'L', color: 'Melange Coffee Tweed', stock: 10, sku: 'BLAZER-COF-L' }
      ]
    }
  ];

  const coupons = [
    {
      id: 'coup-001',
      code: 'WELCOME10',
      description: 'Get 10% instant discount on your first order above ₹999 (Max ₹500)',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 999,
      maxDiscountAmount: 500,
      startDate: '2026-01-01T00:00:00.000Z',
      expiryDate: '2026-12-31T23:59:59.000Z',
      usageLimit: 10000,
      usageCount: 142,
      isActive: true,
      firstOrderOnly: true,
      applicableCategories: []
    },
    {
      id: 'coup-002',
      code: 'KOREAN20',
      description: 'Special 20% off on all Korean Streetwear & Y2K collections (Min ₹1,499, Max ₹800)',
      discountType: 'percentage',
      discountValue: 20,
      minOrderValue: 1499,
      maxDiscountAmount: 800,
      startDate: '2026-01-01T00:00:00.000Z',
      expiryDate: '2026-12-31T23:59:59.000Z',
      usageLimit: 5000,
      usageCount: 318,
      isActive: true,
      firstOrderOnly: false,
      applicableCategories: []
    },
    {
      id: 'coup-003',
      code: 'FREESHIP',
      description: 'Free standard shipping on orders above ₹499',
      discountType: 'shipping',
      discountValue: 99,
      minOrderValue: 499,
      maxDiscountAmount: 99,
      startDate: '2026-01-01T00:00:00.000Z',
      expiryDate: '2026-12-31T23:59:59.000Z',
      usageLimit: 20000,
      usageCount: 890,
      isActive: true,
      firstOrderOnly: false,
      applicableCategories: []
    },
    {
      id: 'coup-004',
      code: 'Y2KVIBES',
      description: 'Flat ₹500 off on order total above ₹2,499',
      discountType: 'fixed',
      discountValue: 500,
      minOrderValue: 2499,
      maxDiscountAmount: 500,
      startDate: '2026-01-01T00:00:00.000Z',
      expiryDate: '2026-12-31T23:59:59.000Z',
      usageLimit: 1000,
      usageCount: 95,
      isActive: true,
      firstOrderOnly: false,
      applicableCategories: []
    }
  ];

  const users = [
    {
      id: 'user-admin-01',
      name: 'Aura Head Administrator',
      email: 'admin@auraseoul.com',
      phone: '+919876543210',
      passwordHash: adminPasswordHash,
      role: 'admin',
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'user-demo-01',
      name: 'Rohan Sharma',
      email: 'customer@auraseoul.com',
      phone: '+919812345678',
      passwordHash: customerPasswordHash,
      role: 'customer',
      createdAt: '2026-02-15T10:30:00.000Z'
    }
  ];

  const addresses = [
    {
      id: 'addr-001',
      userId: 'user-demo-01',
      fullName: 'Rohan Sharma',
      phone: '+919812345678',
      houseDetails: 'Flat 402, Lotus Grand Residences',
      street: '14th Main, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560038',
      country: 'India',
      isDefault: true,
      deliveryInstructions: 'Leave with security guard if unavailable.'
    }
  ];

  const reviews = [
    {
      id: 'rev-001',
      productId: 'prod-001',
      userId: 'user-demo-01',
      userName: 'Rohan S.',
      rating: 5,
      title: 'Supreme quality fabric and authentic drape',
      comment: 'The acid wash finish and 260 GSM heavy weight cotton feel unbelievable. Exactly like the streetwear brands I bought in Hongdae last year. Will order again!',
      isVerifiedPurchase: true,
      createdAt: '2026-03-10T14:22:00.000Z'
    },
    {
      id: 'rev-002',
      productId: 'prod-002',
      userId: 'user-demo-01',
      userName: 'Ananya M.',
      rating: 5,
      title: 'Insane fit with sneakers',
      comment: 'The parachute toggles at the hem allow you to adjust how they stack over thick sneakers. 10/10 recommend!',
      isVerifiedPurchase: true,
      createdAt: '2026-03-18T09:15:00.000Z'
    },
    {
      id: 'rev-003',
      productId: 'prod-003',
      userId: 'user-demo-01',
      userName: 'Dev K.',
      rating: 5,
      title: 'Heavyweight loopback fleece is pure luxury',
      comment: 'The two-way zipper is smooth and heavy metal. Keeps its structured boxy fit even after multiple washes.',
      isVerifiedPurchase: true,
      createdAt: '2026-04-02T16:40:00.000Z'
    }
  ];

  const content = {
    announcements: [
      { id: 'ann-1', text: '✨ Free Express Shipping on All Orders Above ₹999 across India' },
      { id: 'ann-2', text: '🇰🇷 New Seoul Autumn/Winter Drop 03 Now Live — Limited Run' },
      { id: 'ann-3', text: '🎁 Use Code WELCOME10 for 10% Off Your First Order' }
    ],
    heroBanners: [
      {
        id: 'hero-1',
        headline: 'YOUR STYLE. YOUR RULES.',
        subheadline: 'Contemporary Seoul Streetwear meets Y2K Aesthetics. Elevated silhouettes designed for individuality.',
        buttonPrimaryText: 'Shop New Drop',
        buttonPrimaryLink: '/new-arrivals',
        buttonSecondaryText: 'Explore Collection',
        buttonSecondaryLink: '/shop',
        bgImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1920&q=85',
        badge: 'NEW DROP 2026 / VOL. 04'
      }
    ],
    promotionalBanners: [
      {
        id: 'promo-1',
        title: 'Korean Streetwear Edit',
        subtitle: 'Acid wash tees, heavy cargo pants, and structured boxy layers',
        link: '/shop?style=Korean+Streetwear',
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
        tag: 'TRENDING NOW'
      },
      {
        id: 'promo-2',
        title: 'Y2K Starlight Revival',
        subtitle: 'Rhinestone baby tees, metallic lamé, and parachute silhouettes',
        link: '/shop?style=Y2K+Fashion',
        image: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80',
        tag: 'SPECIAL EDITION'
      }
    ],
    siteSettings: {
      brandName: 'AURA SEOUL',
      tagline: 'Contemporary Streetwear & Modern Aesthetics',
      freeShippingThreshold: 999,
      standardShippingFee: 99,
      expressShippingFee: 199,
      supportEmail: 'care@auraseoul.com',
      supportPhone: '+91 80 4920 1800',
      officeAddress: 'Aura Studio Atelier, Indiranagar 100ft Road, Bengaluru 560038, Karnataka, India'
    }
  };

  const orders = [
    {
      id: 'ord-1001',
      orderNumber: 'AURA-2603-9182',
      userId: 'user-demo-01',
      guestEmail: null,
      items: [
        {
          productId: 'prod-001',
          name: 'Seoul Overdrive Acid Wash Graphic Tee',
          size: 'L',
          color: 'Charcoal Acid Wash',
          price: 1299,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80'
        },
        {
          productId: 'prod-002',
          name: 'Cyber Y2K Parachute Cargo Pants',
          size: 'M',
          color: 'Military Sage Green',
          price: 2499,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80'
        }
      ],
      subtotal: 3798,
      discountAmount: 500,
      couponCode: 'Y2KVIBES',
      shippingFee: 0,
      taxAmount: 165,
      totalAmount: 3463,
      status: 'Shipped',
      paymentMethod: 'UPI',
      paymentStatus: 'Completed',
      razorpayPaymentId: 'pay_demo_test_9921',
      shippingAddress: addresses[0],
      deliveryMethod: 'Express Air Shipping (2-3 Days)',
      trackingNumber: 'DELHIVERY-AWB-99281726',
      trackingCarrier: 'Delhivery Express',
      estimatedDeliveryDate: '2026-10-14',
      statusHistory: [
        { status: 'Order Placed', timestamp: '2026-10-08T10:00:00.000Z', note: 'Order placed by customer via UPI' },
        { status: 'Payment Confirmed', timestamp: '2026-10-08T10:02:00.000Z', note: 'Payment verified successfully' },
        { status: 'Processing', timestamp: '2026-10-08T14:30:00.000Z', note: 'Item picked at Bengaluru central fulfillment center' },
        { status: 'Packed', timestamp: '2026-10-09T09:15:00.000Z', note: 'Quality check passed & custom eco-packaged' },
        { status: 'Shipped', timestamp: '2026-10-09T18:00:00.000Z', note: 'Handed over to Delhivery Express Courier' }
      ],
      createdAt: '2026-10-08T10:00:00.000Z'
    }
  ];

  return {
    users,
    categories,
    products,
    coupons,
    addresses,
    reviews,
    orders,
    content,
    carts: [],
    wishlists: [],
    subscribers: [
      { id: 'sub-1', email: 'fashionista@auraseoul.com', subscribedAt: '2026-03-01T12:00:00.000Z' }
    ]
  };
}

module.exports = { getInitialData };
