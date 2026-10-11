import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  Truck,
  ArrowRight,
  MapPin,
  Calendar,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!orderId) return;
    api.getOrder(orderId).then(res => {
      if (res.success && res.data) {
        setOrder(res.data);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Sparkles className="w-8 h-8 text-aura-accent animate-spin" />
        <p className="text-xs uppercase font-bold tracking-widest text-neutral-400">Loading order receipt...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <h2 className="text-xl font-bold font-display uppercase text-aura-black">Order Not Found</h2>
        <p className="text-xs text-neutral-500">Could not retrieve order details. Please check your order history.</p>
        <Link to="/account/orders" className="inline-block bg-aura-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest">
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Badge & Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-9 h-9" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-aura-accent block">
          THANK YOU FOR SHOPPING WITH AURA SEOUL
        </span>
        <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-aura-black">
          Your Order Has Been Confirmed
        </h1>
        <p className="text-xs text-neutral-500 max-w-md mx-auto">
          We’ve received your order and our atelier has begun preparing your garments for custom packaging and dispatch.
        </p>
      </div>

      {/* Order Key Details Card */}
      <div className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-neutral-200 text-xs">
          <div>
            <span className="text-neutral-400 block text-[10px] font-bold uppercase tracking-wider">Order Number</span>
            <span className="font-bold text-aura-black text-sm">{order.orderNumber}</span>
          </div>

          <div>
            <span className="text-neutral-400 block text-[10px] font-bold uppercase tracking-wider">Order Date</span>
            <span className="font-semibold text-aura-black">{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>

          <div>
            <span className="text-neutral-400 block text-[10px] font-bold uppercase tracking-wider">Total Amount</span>
            <span className="font-bold text-aura-black text-sm">₹{order.totalAmount}</span>
          </div>

          <div>
            <span className="text-neutral-400 block text-[10px] font-bold uppercase tracking-wider">Payment Status</span>
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
              {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs pb-6 border-b border-neutral-200">
          <div className="space-y-1.5">
            <h4 className="font-bold uppercase tracking-wider text-aura-black flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-aura-accent" />
              <span>Shipping Address</span>
            </h4>
            <p className="font-semibold text-aura-black">{order.shippingAddress.fullName}</p>
            <p className="text-neutral-600">{order.shippingAddress.houseDetails}</p>
            <p className="text-neutral-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
            <p className="text-neutral-500">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold uppercase tracking-wider text-aura-black flex items-center space-x-1">
              <Truck className="w-4 h-4 text-aura-accent" />
              <span>Fulfillment & Delivery</span>
            </h4>
            <p className="text-neutral-700">Method: <strong>{order.deliveryMethod}</strong></p>
            <p className="text-neutral-700">Carrier: <strong>{order.trackingCarrier}</strong></p>
            <p className="text-neutral-700">AWB Tracking: <strong className="text-aura-accent">{order.trackingNumber}</strong></p>
            <p className="text-emerald-700 font-semibold mt-1">
              Estimated Delivery: {order.estimatedDeliveryDate}
            </p>
          </div>
        </div>

        {/* Ordered Items List */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-aura-black mb-3">
            Garments Ordered ({order.items.length})
          </h4>
          <div className="divide-y divide-neutral-100 text-xs">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={item.image} alt={item.name} className="w-12 h-14 object-cover flex-shrink-0" />
                  <div>
                    <p className="font-bold text-aura-black">{item.name}</p>
                    <p className="text-neutral-500 text-[11px]">{item.size} • {item.color} • Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-aura-black">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="pt-4 border-t border-neutral-200 text-xs space-y-1.5 text-neutral-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Coupon Discount ({order.couponCode})</span>
              <span>-₹{order.discountAmount}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes (GST 5%)</span>
            <span>₹{order.taxAmount}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-black text-aura-black">
            <span>Final Paid Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link
          to={`/order-tracking?orderNumber=${order.orderNumber}`}
          className="w-full sm:w-auto bg-aura-black hover:bg-neutral-800 text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center space-x-2"
        >
          <Truck className="w-4 h-4" />
          <span>Track Order Status</span>
        </Link>

        <Link
          to="/shop"
          className="w-full sm:w-auto border border-neutral-300 hover:border-aura-black text-aura-black px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center space-x-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
