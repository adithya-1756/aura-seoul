import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, Star, ShoppingBag, ArrowRight, ShieldCheck, Ruler } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { SizeGuideModal } from './SizeGuideModal';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [adding, setAdding] = useState<boolean>(false);

  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0] || '');
      setSelectedSize(product.sizes?.[0] || 'M');
      setSelectedColor(product.colors?.[0]?.name || 'Standard');
      setQuantity(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const wishlisted = isWishlisted(product.id);

  // Variant stock check
  const currentVariant = product.variants?.find(
    v => v.size === selectedSize && (!selectedColor || v.color === selectedColor)
  );
  const stockAvailable = currentVariant ? currentVariant.stock : 20;

  const handleAddToCart = async () => {
    if (!selectedSize) return;
    setAdding(true);
    const success = await addToCart(product.id, selectedSize, selectedColor, quantity);
    setAdding(false);
    if (success) {
      onClose();
    }
  };

  const handleViewFull = () => {
    onClose();
    navigate(`/product/${product.slug || product.id}`);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-aura-black hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Left */}
            <div className="p-6 bg-neutral-50 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-neutral-200">
              <div className="w-full aspect-[3/4] overflow-hidden bg-white mb-4 shadow-sm relative group">
                <img
                  src={selectedImage || product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.isOnSale && (
                  <span className="absolute top-3 left-3 bg-aura-black text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                    Sale {product.discountPercent}% Off
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto w-full pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-20 flex-shrink-0 border-2 overflow-hidden transition-all ${
                        selectedImage === img ? 'border-aura-black' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Right */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">
                  <span>{product.style || 'Seoul Streetwear'}</span>
                  <span>•</span>
                  <span>{product.gender}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-display text-aura-black leading-tight mb-2">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center text-aura-accent">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.ratingsAverage || 5)
                            ? 'fill-aura-accent text-aura-accent'
                            : 'text-neutral-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-aura-black">{product.ratingsAverage}</span>
                  <span className="text-xs text-neutral-400">({product.ratingsCount} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline space-x-3 pb-4 border-b border-neutral-100">
                  <span className="text-2xl font-black text-aura-black">₹{product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-sm text-neutral-400 line-through">₹{product.originalPrice}</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5">
                        Save ₹{product.originalPrice - product.price} ({product.discountPercent}%)
                      </span>
                    </>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-xs text-neutral-600 leading-relaxed my-4 line-clamp-3">
                  {product.shortDescription || product.description}
                </p>

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-semibold uppercase tracking-wider mb-2">
                      <span className="text-neutral-500">Color:</span>
                      <span className="text-aura-black">{selectedColor}</span>
                    </div>
                    <div className="flex space-x-2">
                      {product.colors.map(c => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`w-8 h-8 rounded-full border-2 p-0.5 transition-all ${
                            selectedColor === c.name ? 'border-aura-black scale-110' : 'border-transparent'
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

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider mb-2">
                      <span className="text-neutral-500">Size: <span className="text-aura-black">{selectedSize}</span></span>
                      <button
                        onClick={() => setShowSizeGuide(true)}
                        className="text-aura-accent hover:underline flex items-center space-x-1 lowercase font-normal"
                      >
                        <Ruler className="w-3 h-3 mr-0.5 inline" />
                        <span>size guide</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(s => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`min-w-10 h-10 px-3 text-xs font-bold uppercase transition-all border ${
                            selectedSize === s
                              ? 'bg-aura-black text-white border-aura-black'
                              : 'bg-white text-aura-black border-neutral-200 hover:border-aura-black'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock status */}
                <div className="text-xs mb-4">
                  {stockAvailable > 0 ? (
                    <span className="text-emerald-700 flex items-center font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      In Stock ({stockAvailable} units available)
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">Currently Sold Out</span>
                  )}
                </div>
              </div>

              {/* Actions Bottom */}
              <div className="space-y-3 pt-2 border-t border-neutral-100">
                <div className="flex space-x-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-neutral-300 w-28 justify-between px-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-neutral-500 hover:text-aura-black text-base px-2 py-1"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(stockAvailable, quantity + 1))}
                      className="text-neutral-500 hover:text-aura-black text-base px-2 py-1"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={stockAvailable <= 0 || adding}
                    className="flex-1 bg-aura-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest py-3.5 px-4 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{adding ? 'Adding...' : 'Add To Bag'}</span>
                  </button>

                  {/* Wishlist button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3 border transition-colors ${
                      wishlisted
                        ? 'border-red-500 text-red-500 bg-red-50'
                        : 'border-neutral-300 text-neutral-600 hover:border-aura-black hover:text-aura-black'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500' : ''}`} />
                  </button>
                </div>

                {/* View Full Product link */}
                <button
                  onClick={handleViewFull}
                  className="w-full text-center text-xs font-semibold text-aura-black hover:text-aura-accent py-2 uppercase tracking-widest flex items-center justify-center space-x-1"
                >
                  <span>View Complete Details & Care</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </>
  );
};
