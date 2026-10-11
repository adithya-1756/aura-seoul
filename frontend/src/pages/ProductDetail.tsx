import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  Star,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Ruler,
  Check,
  MapPin,
  Sparkles,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SizeGuideModal } from '../components/common/SizeGuideModal';
import { ProductCard } from '../components/common/ProductCard';

export const ProductDetail: React.FC = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [pinCode, setPinCode] = useState<string>('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);
  const [checkingPin, setCheckingPin] = useState<boolean>(false);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!identifier) return;
      setLoading(true);
      try {
        const res = await api.getProductByIdentifier(identifier);
        if (res.success && res.data) {
          const prod: Product = res.data;
          setProduct(prod);
          setSelectedImage(prod.images?.[0] || '');
          setSelectedSize(prod.sizes?.[0] || 'M');
          setSelectedColor(prod.colors?.[0]?.name || 'Standard');
          setRelatedProducts(res.data.related || []);
          setReviews(res.data.reviews || []);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [identifier]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Sparkles className="w-8 h-8 text-aura-accent animate-spin" />
        <p className="text-xs uppercase font-bold tracking-widest text-neutral-400">Loading garment details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold font-display uppercase text-aura-black">Garment Not Found</h2>
        <p className="text-xs text-neutral-500">The requested clothing item is unavailable or has been archived.</p>
        <Link to="/shop" className="inline-block bg-aura-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest">
          Explore Catalog
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  // Check stock for active variant
  const currentVariant = product.variants?.find(
    v => v.size === selectedSize && (!selectedColor || v.color === selectedColor)
  );
  const stockAvailable = currentVariant ? currentVariant.stock : 15;

  const handleAddToCart = async () => {
    if (!selectedSize) {
      showToast('Please select a size.', 'error');
      return;
    }
    await addToCart(product.id, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      showToast('Please select a size.', 'error');
      return;
    }
    const success = await addToCart(product.id, selectedSize, selectedColor, quantity);
    if (success) {
      navigate('/checkout');
    }
  };

  const checkDeliveryPin = (e: React.FormEvent) => {
    e.preventDefault();
    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!pinRegex.test(pinCode.trim())) {
      showToast('Please enter a valid 6-digit Indian PIN code.', 'error');
      return;
    }
    setCheckingPin(true);
    setTimeout(() => {
      setCheckingPin(false);
      const estDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      setDeliveryEstimate(`Express delivery by ${estDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} to ${pinCode}`);
    }, 400);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to submit a review.', 'info');
      navigate('/login');
      return;
    }
    if (!reviewComment.trim()) {
      showToast('Please provide a comment.', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.submitReview({
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment
      });
      if (res.success) {
        showToast(res.message || 'Review submitted successfully!', 'success');
        setReviews([res.data, ...reviews]);
        setReviewTitle('');
        setReviewComment('');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-neutral-400 uppercase tracking-widest">
        <Link to="/" className="hover:text-aura-black">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-aura-black">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-neutral-500">{product.style || product.gender}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-aura-black font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Layout (Gallery + Buying Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnail list */}
          {product.images && product.images.length > 1 && (
            <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-3 overflow-x-auto sm:overflow-y-auto sm:w-24 flex-shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 sm:w-24 aspect-[3/4] border-2 overflow-hidden transition-all flex-shrink-0 ${
                    selectedImage === img ? 'border-aura-black opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image with Zoom */}
          <div
            className="flex-1 aspect-[3/4] overflow-hidden bg-neutral-100 relative cursor-crosshair group"
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <img
              src={selectedImage || product.images?.[0]}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isZoomed ? 'scale-150 cursor-zoom-out' : 'group-hover:scale-105 cursor-zoom-in'
              }`}
            />
            {product.discountPercent && product.discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-aura-crimson text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1">
                {product.discountPercent}% Off Sale
              </span>
            )}
            <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 backdrop-blur-sm pointer-events-none">
              Click to {isZoomed ? 'Reset' : 'Zoom'}
            </span>
          </div>
        </div>

        {/* Right Column: Garment Information & Add To Bag (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">
              <span>{product.style}</span>
              <span>•</span>
              <span>{product.gender}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-display text-aura-black uppercase tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex items-center text-aura-accent">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.ratingsAverage || 5)
                        ? 'fill-aura-accent text-aura-accent'
                        : 'text-neutral-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-aura-black">{product.ratingsAverage}</span>
              <span className="text-xs text-neutral-400">({product.ratingsCount} verified reviews)</span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline space-x-3 mt-4 pb-4 border-b border-neutral-200">
              <span className="text-3xl font-black text-aura-black">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base text-neutral-400 line-through">₹{product.originalPrice}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1">
                    Save ₹{product.originalPrice - product.price} ({product.discountPercent}%)
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">Inclusive of all taxes. Free shipping above ₹999.</p>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="text-neutral-500">Color:</span>
                <span className="text-aura-black font-bold">{selectedColor}</span>
              </div>
              <div className="flex space-x-2.5">
                {product.colors.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-9 h-9 rounded-full border-2 p-0.5 transition-all ${
                      selectedColor === c.name ? 'border-aura-black scale-110 shadow-sm' : 'border-transparent'
                    }`}
                    title={c.name}
                  >
                    <span
                      className="w-full h-full rounded-full block border border-neutral-300"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="text-neutral-500">
                  Size: <span className="text-aura-black font-bold">{selectedSize}</span>
                </span>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-aura-accent hover:underline flex items-center space-x-1 font-bold text-[11px]"
                >
                  <Ruler className="w-3.5 h-3.5 inline mr-1" />
                  <span>View Size Chart</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => {
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-12 h-11 px-3 text-xs font-bold uppercase transition-all border ${
                        isSelected
                          ? 'bg-aura-black text-white border-aura-black'
                          : 'bg-white text-aura-black border-neutral-300 hover:border-aura-black'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock Indicator */}
          <div className="text-xs">
            {stockAvailable > 0 ? (
              <p className="text-emerald-700 font-medium flex items-center">
                <Check className="w-4 h-4 mr-1 text-emerald-600" />
                In Stock ({stockAvailable} pieces ready for dispatch)
              </p>
            ) : (
              <p className="text-red-600 font-medium">Sold Out in this variant</p>
            )}
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-3">
              {/* Quantity selector */}
              <div className="flex items-center border border-neutral-300 w-32 justify-between px-3 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-neutral-500 hover:text-aura-black text-lg px-2"
                >
                  -
                </button>
                <span className="text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stockAvailable, quantity + 1))}
                  className="text-neutral-500 hover:text-aura-black text-lg px-2"
                >
                  +
                </button>
              </div>

              {/* Add To Bag */}
              <button
                onClick={handleAddToCart}
                disabled={stockAvailable <= 0}
                className="flex-1 bg-aura-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest py-4 px-6 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Bag</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 border transition-colors ${
                  wishlisted
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-neutral-300 text-neutral-600 hover:border-aura-black hover:text-aura-black'
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* Buy Now Instant Checkout */}
            <button
              onClick={handleBuyNow}
              disabled={stockAvailable <= 0}
              className="w-full bg-aura-accent hover:bg-aura-accentHover text-black text-xs font-bold uppercase tracking-widest py-3.5 px-6 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Buy Now ✦ Instant Checkout</span>
            </button>
          </div>

          {/* Delivery PIN Code Checker */}
          <div className="p-4 bg-neutral-50 border border-neutral-200/80 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-aura-black">
              <MapPin className="w-4 h-4 text-aura-accent" />
              <span>Check Delivery & Cash on Delivery</span>
            </div>
            <form onSubmit={checkDeliveryPin} className="flex space-x-2">
              <input
                type="text"
                maxLength={6}
                value={pinCode}
                onChange={e => setPinCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN code (e.g. 560038)"
                className="flex-1 bg-white border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-aura-black"
              />
              <button
                type="submit"
                disabled={checkingPin}
                className="bg-aura-black text-white text-xs font-bold uppercase px-4 py-2 hover:bg-neutral-800"
              >
                {checkingPin ? 'Checking...' : 'Check'}
              </button>
            </form>
            {deliveryEstimate && (
              <p className="text-xs text-emerald-700 font-semibold flex items-center mt-2">
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                <span>{deliveryEstimate}</span>
              </p>
            )}
          </div>

          {/* Fabric, Care & Policies Accordion */}
          <div className="border-t border-neutral-200 pt-4 space-y-3 text-xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-aura-black">Fabric & Material: </span>
              <span className="text-neutral-600">{product.fabric}</span>
            </div>
            <div>
              <span className="font-bold uppercase tracking-wider text-aura-black">Silhouette & Fit: </span>
              <span className="text-neutral-600">{product.fit}</span>
            </div>
            {product.careInstructions && (
              <div>
                <span className="font-bold uppercase tracking-wider text-aura-black">Care Instructions: </span>
                <span className="text-neutral-600">{product.careInstructions}</span>
              </div>
            )}
            <div className="pt-2 flex flex-col space-y-1.5 text-neutral-500">
              <p className="flex items-center"><Truck className="w-3.5 h-3.5 mr-1.5 text-aura-accent" /> Free shipping on prepaid and COD orders above ₹999.</p>
              <p className="flex items-center"><RotateCcw className="w-3.5 h-3.5 mr-1.5 text-aura-accent" /> 7-day doorstep return and size exchange guarantee.</p>
              <p className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-aura-accent" /> Guaranteed 100% genuine Aura Seoul atelier garment.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="border-t border-neutral-200 pt-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-aura-accent">Community Feedback</span>
            <h2 className="text-2xl font-black font-display uppercase tracking-tight text-aura-black mt-1">
              Customer Reviews ({reviews.length})
            </h2>
          </div>
          <div className="flex items-center space-x-2 text-aura-accent">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-aura-accent" />
              ))}
            </div>
            <span className="text-xs font-bold text-aura-black">{product.ratingsAverage} out of 5 stars</span>
          </div>
        </div>

        {/* Existing Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(r => (
            <div key={r.id} className="p-6 bg-neutral-50 border border-neutral-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex text-aura-accent">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-aura-accent" />
                  ))}
                </div>
                <span className="text-[10px] text-neutral-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className="text-sm font-bold text-aura-black">{r.title || 'Great Quality'}</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">{r.comment}</p>
              <div className="pt-2 flex items-center space-x-2 text-[11px] text-neutral-500">
                <span className="font-semibold text-aura-black">{r.userName}</span>
                {r.isVerifiedPurchase && (
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5">
                    <Check className="w-3 h-3 mr-0.5" /> Verified Buyer
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Write a Review Form */}
        <div className="p-6 sm:p-8 bg-white border border-neutral-200 max-w-2xl space-y-4">
          <h3 className="text-base font-bold font-display uppercase tracking-wider text-aura-black">
            Write a Review
          </h3>
          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-neutral-500 mb-1">Your Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= reviewRating
                          ? 'fill-aura-accent text-aura-accent'
                          : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-neutral-500 mb-1">Review Headline</label>
              <input
                type="text"
                value={reviewTitle}
                onChange={e => setReviewTitle(e.target.value)}
                placeholder="e.g. Exceptional fabric weight, fits perfectly!"
                className="w-full border border-neutral-300 p-2.5 outline-none focus:border-aura-black"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-neutral-500 mb-1">Detailed Review</label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Share your thoughts on the drape, sizing, stitching, and style..."
                className="w-full border border-neutral-300 p-2.5 outline-none focus:border-aura-black"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="bg-aura-black text-white px-6 py-3 font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
            >
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-neutral-200 pt-12 space-y-8">
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-aura-accent">Complete The Look</span>
            <h2 className="text-2xl font-black font-display uppercase tracking-tight text-aura-black mt-1">
              Related Garments
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(rp => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </div>
  );
};
