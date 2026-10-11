import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Product } from '../types';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [movingId, setMovingId] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  const handleMoveToCart = async (product: Product) => {
    const size = selectedSizes[product.id] || product.sizes?.[0] || 'M';
    const color = product.colors?.[0]?.name || 'Standard';

    setMovingId(product.id);
    const success = await addToCart(product.id, size, color, 1);
    setMovingId(null);

    if (success) {
      await removeFromWishlist(product.id);
      showToast(`Moved ${product.name} to shopping bag.`, 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-aura-black">
            My Wishlist ({wishlist.length})
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Garments saved for later consideration. Ready to move to your shopping bag.
          </p>
        </div>
        <Link
          to="/shop"
          className="text-xs font-bold uppercase tracking-widest text-aura-black hover:text-aura-accent flex items-center space-x-1"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-neutral-300 p-8 space-y-4 max-w-md mx-auto">
          <Heart className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-lg font-bold font-display uppercase tracking-wider text-aura-black">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs text-neutral-500">
            Explore our drops and click the heart icon on any product to save it here for later.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-aura-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            Explore Streetwear
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map(product => {
            const currentSize = selectedSizes[product.id] || product.sizes?.[0] || 'M';
            return (
              <div
                key={product.id}
                className="bg-white border border-neutral-200 flex flex-col justify-between group overflow-hidden"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                  <Link to={`/product/${product.slug || product.id}`}>
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label="Remove from wishlist"
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-500 hover:text-red-500 flex items-center justify-center shadow-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      {product.style || product.gender}
                    </span>
                    <Link
                      to={`/product/${product.slug || product.id}`}
                      className="block text-sm font-semibold text-aura-black hover:text-aura-accent line-clamp-1 mt-0.5"
                    >
                      {product.name}
                    </Link>

                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-sm font-bold text-aura-black">₹{product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-neutral-400 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  {/* Size selection */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Select Size:</span>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map(s => (
                          <button
                            key={s}
                            onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: s }))}
                            className={`px-2 py-1 text-[11px] font-bold uppercase border transition-colors ${
                              currentSize === s
                                ? 'bg-aura-black text-white border-aura-black'
                                : 'border-neutral-200 text-neutral-700 hover:border-aura-black'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Move to bag button */}
                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={movingId === product.id}
                    className="w-full bg-aura-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest py-3 flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{movingId === product.id ? 'Moving...' : 'Move to Bag'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
