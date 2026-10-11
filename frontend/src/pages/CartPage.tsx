import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Truck,
  CheckCircle,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) {
      showToast('Please enter a coupon code.', 'error');
      return;
    }
    setApplyingCoupon(true);
    const success = await applyCoupon(couponInput.trim());
    setApplyingCoupon(false);
    if (success) {
      setCouponInput('');
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md mx-auto text-center border border-dashed border-neutral-300 p-10 space-y-4">
          <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
          <h1 className="text-xl font-bold font-display uppercase tracking-wider text-aura-black">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-xs text-neutral-500">
            You have no items in your shopping bag. Explore our newest drops and limited collections.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-aura-black hover:bg-neutral-800 text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors shadow-sm"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const freeShippingThreshold = cart.freeShippingThreshold || 999;
  const progressPercent = Math.min(100, Math.round((cart.subtotal / freeShippingThreshold) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-aura-black">
          Shopping Bag ({cart.items.reduce((s, it) => s + it.quantity, 0)})
        </h1>
      </div>

      {/* Free Shipping Dynamic Progress Indicator */}
      <div className="bg-neutral-100 p-4 border border-neutral-200 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold tracking-wider uppercase text-aura-black">
          <div className="flex items-center space-x-1.5">
            <Truck className="w-4 h-4 text-aura-accent" />
            {cart.isEligibleForFreeShipping ? (
              <span className="text-emerald-700">Congratulations! You've unlocked FREE EXPRESS SHIPPING!</span>
            ) : (
              <span>Add ₹{cart.freeShippingDifference} more to qualify for FREE SHIPPING</span>
            )}
          </div>
          <span className="text-[11px] text-neutral-500">{progressPercent}%</span>
        </div>
        <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              cart.isEligibleForFreeShipping ? 'bg-emerald-600' : 'bg-aura-accent'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Cart Content: Items Left (8 cols), Summary Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
            {cart.items.map((item, idx) => (
              <div key={`${item.productId}-${item.size}-${item.color}-${idx}`} className="py-6 flex space-x-4 sm:space-x-6">
                {/* Product Image */}
                <Link
                  to={`/product/${item.product?.slug || item.productId}`}
                  className="w-20 sm:w-28 aspect-[3/4] bg-neutral-100 flex-shrink-0 overflow-hidden"
                >
                  <img
                    src={item.product?.images?.[0]}
                    alt={item.product?.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Info & Quantity */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <Link
                        to={`/product/${item.product?.slug || item.productId}`}
                        className="text-sm sm:text-base font-bold text-aura-black hover:text-aura-accent transition-colors line-clamp-1"
                      >
                        {item.product?.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.productId, item.size, item.color)}
                        aria-label="Remove item"
                        className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-neutral-500 space-x-3">
                      <span>Size: <strong className="text-aura-black">{item.size}</strong></span>
                      <span>Color: <strong className="text-aura-black">{item.color}</strong></span>
                    </div>

                    <p className="text-xs text-neutral-400">{item.product?.fabric}</p>
                  </div>

                  {/* Quantity & Price Row */}
                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-neutral-100">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-neutral-300 px-2 py-1 space-x-3">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                        className="text-neutral-500 hover:text-aura-black px-1"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        className="text-neutral-500 hover:text-aura-black px-1"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <span className="text-sm sm:text-base font-bold text-aura-black">
                        ₹{(item.product?.price || 0) * item.quantity}
                      </span>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-neutral-400">
                          (₹{item.product?.price} each)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-aura-black hover:text-aura-accent pt-2"
          >
            <span>← Continue Shopping</span>
          </Link>
        </div>

        {/* Order Summary Right */}
        <div className="lg:col-span-4">
          <div className="bg-neutral-50 border border-neutral-200 p-6 space-y-6 sticky top-28">
            <h3 className="text-base font-bold font-display uppercase tracking-wider text-aura-black border-b border-neutral-200 pb-3">
              Order Summary
            </h3>

            {/* Subtotals Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-aura-black">₹{cart.subtotal}</span>
              </div>

              {cart.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({cart.appliedCoupon})</span>
                  <span>-₹{cart.discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>Shipping Charges</span>
                <span>
                  {cart.shippingFee === 0 ? (
                    <strong className="text-emerald-700 uppercase">FREE</strong>
                  ) : (
                    `₹${cart.shippingFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Estimated GST Tax (5%)</span>
                <span>₹{cart.taxAmount}</span>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-between text-sm sm:text-base font-black text-aura-black">
                <span>Total Amount</span>
                <span>₹{cart.finalTotal}</span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="pt-2 border-t border-neutral-200">
              {cart.appliedCoupon ? (
                <div className="bg-emerald-50 border border-emerald-300 p-3 flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Coupon <strong>{cart.appliedCoupon}</strong> Applied!</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 hover:text-red-700 transition-colors"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label htmlFor="coupon" className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Have a promo coupon?
                  </label>
                  <div className="flex border border-neutral-300 bg-white focus-within:border-aura-black">
                    <input
                      id="coupon"
                      type="text"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      placeholder="e.g. WELCOME10, KOREAN20"
                      className="w-full px-3 py-2 text-xs uppercase font-bold outline-none"
                    />
                    <button
                      type="submit"
                      disabled={applyingCoupon}
                      className="bg-aura-black text-white px-4 py-2 text-xs font-bold uppercase hover:bg-neutral-800 transition-colors flex-shrink-0"
                    >
                      {applyingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-400">
                    Try: <strong>WELCOME10</strong> (10% off) or <strong>KOREAN20</strong> (20% off)
                  </p>
                </form>
              )}
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-aura-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest py-4 px-6 flex items-center justify-center space-x-2 transition-all shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Badges */}
            <div className="pt-2 text-center text-[10px] text-neutral-500 space-y-1">
              <p className="flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-aura-accent" />
                <span>256-Bit SSL Encrypted & Verified Checkout</span>
              </p>
              <p>Supported: UPI, Cards, Netbanking, Cash on Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
