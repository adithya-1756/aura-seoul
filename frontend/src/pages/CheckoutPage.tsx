import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle,
  Truck,
  CreditCard,
  MapPin,
  User,
  ShoppingBag,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Address } from '../types';

export const CheckoutPage: React.FC = () => {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);

  // Step 1: Contact
  const [contact, setContact] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Step 2: Address
  const [address, setAddress] = useState<Address>({
    id: '',
    fullName: user?.name || '',
    phone: user?.phone || '',
    houseDetails: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
    deliveryInstructions: ''
  });

  // Step 3: Delivery Method
  const [deliveryMethod, setDeliveryMethod] = useState<string>('Standard Express Delivery (3-4 Business Days)');

  // Step 4: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI');

  useEffect(() => {
    if (user) {
      setContact({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      // Fetch saved addresses
      api.getAddresses().then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setSavedAddresses(res.data);
          const defaultAddr = res.data.find((a: Address) => a.isDefault) || res.data[0];
          setAddress(defaultAddr);
        }
      });
    }
  }, [user]);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold font-display uppercase text-aura-black">Shopping Bag is Empty</h2>
        <p className="text-xs text-neutral-500">Please add clothing items to your shopping bag before checking out.</p>
        <Link to="/shop" className="inline-block bg-aura-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest">
          Explore Collections
        </Link>
      </div>
    );
  }

  const validateStep1 = () => {
    if (!contact.name.trim() || !contact.email.trim() || !contact.phone.trim()) {
      showToast('Please fill out all contact fields.', 'error');
      return false;
    }
    if (!contact.email.includes('@')) {
      showToast('Please provide a valid email.', 'error');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!address.houseDetails.trim() || !address.city.trim() || !address.state.trim() || !address.pinCode.trim()) {
      showToast('Please fill out complete address details.', 'error');
      return false;
    }
    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!pinRegex.test(address.pinCode.toString().trim())) {
      showToast('Please enter a valid 6-digit Indian PIN code.', 'error');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderPayload = {
        contact,
        shippingAddress: address,
        deliveryMethod,
        paymentMethod,
        couponCode: cart.appliedCoupon,
        items: cart.items.map(it => ({
          productId: it.productId,
          size: it.size,
          color: it.color,
          quantity: it.quantity
        }))
      };

      const res = await api.checkout(orderPayload);
      if (res.success && res.data) {
        showToast('Order confirmed! Generating receipt...', 'success');
        await refreshCart();
        navigate(`/order-confirmation/${res.data.orderNumber || res.data.id}`);
      }
    } catch (err: any) {
      showToast(err.message || 'Checkout failed. Please verify and try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Progress Stepper */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
          <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-aura-black' : 'text-neutral-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-aura-black text-white' : 'bg-neutral-200'}`}>1</span>
            <span className="hidden sm:inline">Contact</span>
          </div>
          <div className="flex-1 h-0.5 bg-neutral-200 mx-2" />

          <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-aura-black' : 'text-neutral-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-aura-black text-white' : 'bg-neutral-200'}`}>2</span>
            <span className="hidden sm:inline">Delivery</span>
          </div>
          <div className="flex-1 h-0.5 bg-neutral-200 mx-2" />

          <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-aura-black' : 'text-neutral-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-aura-black text-white' : 'bg-neutral-200'}`}>3</span>
            <span className="hidden sm:inline">Shipping</span>
          </div>
          <div className="flex-1 h-0.5 bg-neutral-200 mx-2" />

          <div className={`flex items-center space-x-2 ${step >= 4 ? 'text-aura-black' : 'text-neutral-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 4 ? 'bg-aura-black text-white' : 'bg-neutral-200'}`}>4</span>
            <span className="hidden sm:inline">Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Main Steps Form (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 border border-neutral-200 space-y-6">
          {/* STEP 1: Contact Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold font-display uppercase tracking-wider text-aura-black flex items-center space-x-2">
                  <User className="w-5 h-5 text-aura-accent" />
                  <span>Step 1: Contact Information</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-1">We will send your order confirmation and dispatch tracking updates here.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={e => setContact({ ...contact, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full border border-neutral-300 p-3 outline-none focus:border-aura-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={contact.email}
                      onChange={e => setContact({ ...contact, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full border border-neutral-300 p-3 outline-none focus:border-aura-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">Mobile Phone (India)</label>
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={e => setContact({ ...contact, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full border border-neutral-300 p-3 outline-none focus:border-aura-black"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-aura-black text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center space-x-2"
                >
                  <span>Continue to Delivery Address</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Address */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold font-display uppercase tracking-wider text-aura-black flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-aura-accent" />
                  <span>Step 2: Delivery Address</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-1">Doorstep delivery across all cities & PIN codes in India.</p>
              </div>

              {/* Saved Address Selector if available */}
              {savedAddresses.length > 0 && (
                <div className="bg-neutral-50 p-4 border border-neutral-200 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Select Saved Address:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {savedAddresses.map(sa => (
                      <button
                        key={sa.id}
                        type="button"
                        onClick={() => setAddress(sa)}
                        className={`p-3 text-left border text-xs transition-colors ${
                          address.id === sa.id ? 'border-aura-black bg-white ring-1 ring-aura-black' : 'border-neutral-200 bg-white hover:border-neutral-400'
                        }`}
                      >
                        <p className="font-bold text-aura-black">{sa.fullName}</p>
                        <p className="text-neutral-500 truncate">{sa.houseDetails}, {sa.city}</p>
                        <p className="text-neutral-500">{sa.pinCode}, {sa.state}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">House / Flat / Building / Street</label>
                  <input
                    type="text"
                    value={address.houseDetails}
                    onChange={e => setAddress({ ...address, houseDetails: e.target.value })}
                    placeholder="e.g. Flat 402, Lotus Grand, 14th Main"
                    className="w-full border border-neutral-300 p-3 outline-none focus:border-aura-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={e => setAddress({ ...address, city: e.target.value })}
                      placeholder="e.g. Bengaluru"
                      className="w-full border border-neutral-300 p-3 outline-none focus:border-aura-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">State</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={e => setAddress({ ...address, state: e.target.value })}
                      placeholder="e.g. Karnataka"
                      className="w-full border border-neutral-300 p-3 outline-none focus:border-aura-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">PIN Code (6 Digits)</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={address.pinCode}
                      onChange={e => setAddress({ ...address, pinCode: e.target.value.replace(/\D/g, '') })}
                      placeholder="e.g. 560038"
                      className="w-full border border-neutral-300 p-3 outline-none focus:border-aura-black font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">Optional Delivery Instructions</label>
                  <input
                    type="text"
                    value={address.deliveryInstructions || ''}
                    onChange={e => setAddress({ ...address, deliveryInstructions: e.target.value })}
                    placeholder="e.g. Leave with reception / call on arrival"
                    className="w-full border border-neutral-300 p-3 outline-none focus:border-aura-black"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="border border-neutral-300 px-6 py-3 text-xs font-bold uppercase hover:border-aura-black"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-aura-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center space-x-2"
                >
                  <span>Continue to Shipping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Delivery Method */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold font-display uppercase tracking-wider text-aura-black flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-aura-accent" />
                  <span>Step 3: Select Delivery Speed</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-1">Choose between standard surface courier and prioritized express air shipping.</p>
              </div>

              <div className="space-y-3 text-xs">
                <label className={`block p-4 border cursor-pointer transition-colors ${
                  deliveryMethod.includes('Standard') ? 'border-aura-black bg-neutral-50 ring-1 ring-aura-black' : 'border-neutral-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod.includes('Standard')}
                        onChange={() => setDeliveryMethod('Standard Express Delivery (3-4 Business Days)')}
                      />
                      <div>
                        <p className="font-bold text-aura-black">Standard Express Delivery (3-4 Business Days)</p>
                        <p className="text-neutral-500">Delivered via Delhivery / BlueDart with doorstep live tracking.</p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-700">
                      {cart.subtotal >= 999 ? 'FREE' : '₹99'}
                    </span>
                  </div>
                </label>

                <label className={`block p-4 border cursor-pointer transition-colors ${
                  deliveryMethod.includes('Air') ? 'border-aura-black bg-neutral-50 ring-1 ring-aura-black' : 'border-neutral-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod.includes('Air')}
                        onChange={() => setDeliveryMethod('Priority Air Express (1-2 Business Days)')}
                      />
                      <div>
                        <p className="font-bold text-aura-black">Priority Air Express (1-2 Business Days)</p>
                        <p className="text-neutral-500">Fastest air fulfillment dispatch directly from central depot.</p>
                      </div>
                    </div>
                    <span className="font-bold text-aura-black">₹199</span>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="border border-neutral-300 px-6 py-3 text-xs font-bold uppercase hover:border-aura-black"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-aura-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center space-x-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Payment Method */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold font-display uppercase tracking-wider text-aura-black flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-aura-accent" />
                  <span>Step 4: Select Payment Method</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-1">All transactions are encrypted with 256-bit bank-grade security.</p>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { id: 'UPI', label: 'UPI (Google Pay, PhonePe, Paytm, BHIM)', note: 'Instant confirmation with zero transaction fees.' },
                  { id: 'Debit or Credit Card', label: 'Credit or Debit Card (Visa, Mastercard, RuPay)', note: 'Secure payment with instant OTP authentication.' },
                  { id: 'Net Banking', label: 'Net Banking (All Indian Banks)', note: 'HDFC, ICICI, SBI, Axis, Kotak and 50+ banks.' },
                  { id: 'Cash on Delivery', label: 'Cash on Delivery (COD)', note: 'Pay in cash or scan QR with delivery agent at doorstep.' },
                  { id: 'Razorpay Test Mode', label: 'Razorpay Payment Gateway (Sandbox / Test Mode)', note: 'Simulate instant card/UPI callback verification.' }
                ].map(p => (
                  <label
                    key={p.id}
                    className={`block p-4 border cursor-pointer transition-colors ${
                      paymentMethod === p.id ? 'border-aura-black bg-neutral-50 ring-1 ring-aura-black' : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === p.id}
                        onChange={() => setPaymentMethod(p.id)}
                        className="mt-0.5"
                      />
                      <div>
                        <p className="font-bold text-aura-black">{p.label}</p>
                        <p className="text-neutral-500 mt-0.5">{p.note}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Order Confirmation CTA */}
              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="border border-neutral-300 px-6 py-3 text-xs font-bold uppercase hover:border-aura-black"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="bg-aura-accent hover:bg-aura-accentHover text-black px-9 py-4 text-xs font-bold uppercase tracking-widest transition-all shadow-lg flex items-center space-x-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? 'Processing Order...' : `Pay ₹${cart.finalTotal} & Place Order`}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-neutral-50 border border-neutral-200 p-6 space-y-4">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-aura-black border-b border-neutral-200 pb-2">
              Bag Summary ({cart.items.length} items)
            </h3>

            <div className="divide-y divide-neutral-200 max-h-60 overflow-y-auto pr-1 text-xs">
              {cart.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 truncate mr-2">
                    <img src={item.product?.images?.[0]} alt="" className="w-10 h-12 object-cover flex-shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-aura-black truncate">{item.product?.name}</p>
                      <p className="text-neutral-400 text-[10px]">{item.size} • {item.color} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-aura-black">₹{(item.product?.price || 0) * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs pt-2 border-t border-neutral-200">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>₹{cart.subtotal}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon ({cart.appliedCoupon})</span>
                  <span>-₹{cart.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span>{cart.shippingFee === 0 ? 'FREE' : `₹${cart.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>GST Tax (5%)</span>
                <span>₹{cart.taxAmount}</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between text-base font-black text-aura-black">
                <span>Final Total</span>
                <span>₹{cart.finalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
