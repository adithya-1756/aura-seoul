import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'M');
  const [showQuickAddSize, setShowQuickAddSize] = useState(false);

  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const wishlisted = isWishlisted(product.id);
  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';
  const hoverImage = product.images?.[1] || primaryImage;

  const handleQuickAdd = async (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product.id, size, product.colors?.[0]?.name || 'Standard', 1);
    setShowQuickAddSize(false);
  };

  return (
    <>
      <div
        className="group relative flex flex-col bg-white border border-transparent hover:border-neutral-200/80 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowQuickAddSize(false);
        }}
      >
        {/* Image Container with Badges & Action Buttons */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 cursor-pointer">
          <Link to={`/product/${product.slug || product.id}`}>
            <img
              src={isHovered ? hoverImage : primaryImage}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </Link>

          {/* Badges Top-Left */}
          <div className="absolute top-2.5 left-2.5 flex flex-col space-y-1 z-10 pointer-events-none">
            {product.isNewArrival && (
              <span className="bg-aura-black text-white text-[10px] font-bold tracking-widest uppercase px-2 py-0.5">
                New Drop
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-aura-accent text-white text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 shadow-sm">
                Best Seller
              </span>
            )}
            {product.discountPercent && product.discountPercent > 0 && (
              <span className="bg-aura-crimson text-white text-[10px] font-bold tracking-widest uppercase px-2 py-0.5">
                -{product.discountPercent}%
              </span>
            )}
          </div>

          {/* Wishlist Button Top-Right */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label="Add to wishlist"
            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-neutral-600 hover:text-red-500 shadow-sm transition-all"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          {/* Action Overlay Bottom on Hover */}
          <div
            className={`absolute inset-x-2 bottom-2 z-10 flex flex-col space-y-1.5 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            {/* Quick Size Selector popup if toggled */}
            {showQuickAddSize && (
              <div className="bg-white/95 backdrop-blur-md p-2 shadow-lg border border-neutral-200 flex flex-wrap gap-1 justify-center animate-fadeIn">
                <span className="w-full text-[10px] font-bold uppercase tracking-wider text-center text-neutral-500 mb-1">
                  Select Size to Add:
                </span>
                {product.sizes?.map(s => (
                  <button
                    key={s}
                    onClick={(e) => handleQuickAdd(e, s)}
                    className="px-2 py-1 text-[11px] font-bold border border-neutral-300 hover:border-aura-black hover:bg-aura-black hover:text-white transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="flex space-x-1.5">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQuickView(true);
                }}
                className="flex-1 bg-white/95 hover:bg-white text-aura-black py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider shadow-sm flex items-center justify-center space-x-1 border border-neutral-200 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Quick View</span>
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQuickAddSize(prev => !prev);
                }}
                className="flex-1 bg-aura-black hover:bg-neutral-800 text-white py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider shadow-sm flex items-center justify-center space-x-1 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Info Bottom */}
        <div className="pt-3.5 pb-2 px-1 flex flex-col flex-grow">
          {/* Style & Ratings */}
          <div className="flex items-center justify-between text-[11px] text-neutral-400 uppercase tracking-wider mb-1">
            <span>{product.style || product.gender}</span>
            {product.ratingsAverage > 0 && (
              <div className="flex items-center space-x-0.5 text-neutral-700 font-semibold">
                <Star className="w-3 h-3 fill-aura-accent text-aura-accent" />
                <span>{product.ratingsAverage}</span>
              </div>
            )}
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug || product.id}`}
            className="text-sm font-semibold text-aura-black hover:text-aura-accent transition-colors line-clamp-1 mb-1.5"
          >
            {product.name}
          </Link>

          {/* Price row */}
          <div className="flex items-baseline space-x-2 mt-auto">
            <span className="text-sm font-bold text-aura-black">₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through">₹{product.originalPrice}</span>
            )}
            {product.discountPercent && product.discountPercent > 0 && (
              <span className="text-[10px] font-bold text-aura-crimson uppercase">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Color Dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center space-x-1.5 mt-2.5 pt-2 border-t border-neutral-100">
              {product.colors.slice(0, 4).map((c, idx) => (
                <span
                  key={idx}
                  title={c.name}
                  className="w-3 h-3 rounded-full border border-neutral-300"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-neutral-400">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
};
