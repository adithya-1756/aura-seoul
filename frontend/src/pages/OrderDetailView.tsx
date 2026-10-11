import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
  RotateCcw,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';
import { useToast } from '../context/ToastContext';

export const OrderDetailView: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of mind');

  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnType, setReturnType] = useState<'return' | 'exchange'>('return');
  const [returnReason, setReturnReason] = useState('Size was too large / small');
  const [submittingReturn, setSubmittingReturn] = useState(false);

  const { showToast } = useToast();

  const fetchOrder = async () => {
    if (!orderId) return;
    try {
      const res = await api.getOrder(orderId);
      if (res.success) setOrder(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div className="py-24 text-center text-xs text-neutral-400 uppercase tracking-widest">Loading order...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <h2 className="text-xl font-bold font-display uppercase text-aura-black">Order Not Found</h2>
        <Link to="/account/orders" className="inline-block bg-aura-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest">
          View All Orders
        </Link>
      </div>
    );
  }

  const cancellableStatuses = ['Order Placed', 'Payment Confirmed', 'Processing'];
  const canCancel = cancellableStatuses.includes(order.status);
  const canReturn = order.status === 'Delivered';

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      const res = await api.cancelOrder(order.id, cancelReason);
      if (res.success) {
        showToast('Order cancelled successfully.', 'success');
        setCancelModalOpen(false);
        fetchOrder();
      }
    } catch (err: any) {
      showToast(err.message || 'Cancellation failed.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const handleRequestReturn = async () => {
    setSubmittingReturn(true);
    try {
      const res = await api.requestReturn(order.id, {
        type: returnType,
        reason: returnReason,
        items: order.items
      });
      if (res.success) {
        showToast(res.message || 'Return request submitted.', 'success');
        setReturnModalOpen(false);
        fetchOrder();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit return request.', 'error');
    } finally {
      setSubmittingReturn(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-neutral-400 uppercase tracking-widest">
        <Link to="/" className="hover:text-aura-black">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/account" className="hover:text-aura-black">Account</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/account/orders" className="hover:text-aura-black">Orders</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-aura-black font-semibold">#{order.orderNumber}</span>
      </div>

      {/* Header with Actions */}
      <div className="border-b border-neutral-200 pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-aura-accent">
            ORDER SUMMARY & INVOICE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-aura-black mt-1">
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleString()} • Paid via {order.paymentMethod}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to={`/order-tracking?orderNumber=${order.orderNumber}`}
            className="bg-aura-black hover:bg-neutral-800 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5"
          >
            <Truck className="w-4 h-4" />
            <span>Track Delivery</span>
          </Link>

          {canCancel && (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="border border-red-300 text-red-600 hover:bg-red-50 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Cancel Order
            </button>
          )}

          {canReturn && (
            <button
              onClick={() => setReturnModalOpen(true)}
              className="border border-aura-black text-aura-black hover:bg-neutral-100 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Return / Exchange</span>
            </button>
          )}
        </div>
      </div>

      {/* Order Status Notification Banner */}
      <div className={`p-4 border text-xs flex items-center justify-between ${
        order.status === 'Cancelled' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
      }`}>
        <div className="flex items-center space-x-2">
          {order.status === 'Cancelled' ? <XCircle className="w-5 h-5 text-red-600" /> : <Clock className="w-5 h-5 text-aura-accent" />}
          <div>
            <span className="font-bold uppercase tracking-wider">Status: {order.status}</span>
            <p className="text-neutral-500 text-[11px]">Carrier: {order.trackingCarrier} • Tracking: {order.trackingNumber}</p>
          </div>
        </div>
        <span className="font-semibold text-emerald-700">Payment: {order.paymentStatus}</span>
      </div>

      {/* Garments List */}
      <div className="bg-white border border-neutral-200 p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-aura-black border-b border-neutral-100 pb-2">
          Garments in this Shipment ({order.items.length})
        </h3>
        <div className="divide-y divide-neutral-100 text-xs">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={item.image} alt={item.name} className="w-14 h-16 object-cover flex-shrink-0" />
                <div>
                  <Link to={`/product/${item.slug || item.productId}`} className="font-bold text-aura-black hover:text-aura-accent">
                    {item.name}
                  </Link>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                  </p>
                  <p className="font-semibold text-aura-black mt-1">₹{item.price} each</p>
                </div>
              </div>
              <span className="font-bold text-aura-black text-sm">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery & Financial Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white border border-neutral-200 p-6 space-y-3 text-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-aura-black border-b border-neutral-100 pb-2 flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-aura-accent" />
            <span>Delivery Destination</span>
          </h3>
          <p className="font-bold text-aura-black">{order.shippingAddress.fullName}</p>
          <p className="text-neutral-600">{order.shippingAddress.houseDetails}</p>
          {order.shippingAddress.street && <p className="text-neutral-600">{order.shippingAddress.street}</p>}
          <p className="text-neutral-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
          <p className="text-neutral-500">Phone: {order.shippingAddress.phone}</p>
          {order.shippingAddress.deliveryInstructions && (
            <p className="text-neutral-400 italic">"{order.shippingAddress.deliveryInstructions}"</p>
          )}
        </div>

        {/* Invoice Price Breakdown */}
        <div className="bg-white border border-neutral-200 p-6 space-y-2 text-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-aura-black border-b border-neutral-100 pb-2">
            Invoice Summary
          </h3>
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Coupon Discount ({order.couponCode})</span>
              <span>-₹{order.discountAmount}</span>
            </div>
          )}
          <div className="flex justify-between text-neutral-600">
            <span>Shipping</span>
            <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Taxes (GST 5%)</span>
            <span>₹{order.taxAmount}</span>
          </div>
          <div className="pt-2 border-t border-neutral-200 flex justify-between text-base font-black text-aura-black">
            <span>Final Paid Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md p-6 space-y-4 text-xs shadow-2xl border border-neutral-200">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-aura-black">
              Cancel Order #{order.orderNumber}
            </h3>
            <p className="text-neutral-600">
              Are you sure you want to cancel this order? The reserved inventory will be returned to stock.
            </p>
            <div>
              <label className="block font-bold uppercase tracking-wider text-neutral-500 mb-1">Reason for cancellation</label>
              <select
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                className="w-full border border-neutral-300 p-2.5 outline-none font-medium"
              >
                <option value="Change of mind">Change of mind</option>
                <option value="Ordered wrong size or color">Ordered wrong size or color</option>
                <option value="Delivery time is too long">Delivery time is too long</option>
                <option value="Found alternative product">Found alternative product</option>
              </select>
            </div>
            <div className="pt-3 flex justify-end space-x-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="border border-neutral-300 px-4 py-2 font-bold uppercase"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="bg-red-600 text-white px-5 py-2 font-bold uppercase hover:bg-red-700"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return / Exchange Modal */}
      {returnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md p-6 space-y-4 text-xs shadow-2xl border border-neutral-200">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-aura-black">
              Request 7-Day Return / Exchange
            </h3>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setReturnType('return')}
                  className={`flex-1 py-2 font-bold uppercase border ${
                    returnType === 'return' ? 'bg-aura-black text-white border-aura-black' : 'border-neutral-300'
                  }`}
                >
                  Return & Refund
                </button>
                <button
                  type="button"
                  onClick={() => setReturnType('exchange')}
                  className={`flex-1 py-2 font-bold uppercase border ${
                    returnType === 'exchange' ? 'bg-aura-black text-white border-aura-black' : 'border-neutral-300'
                  }`}
                >
                  Size Exchange
                </button>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-500 mb-1">Reason</label>
                <textarea
                  rows={3}
                  value={returnReason}
                  onChange={e => setReturnReason(e.target.value)}
                  className="w-full border border-neutral-300 p-2.5 outline-none"
                  placeholder="Explain why you are requesting a return or exchange..."
                  required
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end space-x-3">
              <button
                onClick={() => setReturnModalOpen(false)}
                className="border border-neutral-300 px-4 py-2 font-bold uppercase"
              >
                Close
              </button>
              <button
                onClick={handleRequestReturn}
                disabled={submittingReturn}
                className="bg-aura-black text-white px-5 py-2 font-bold uppercase hover:bg-neutral-800"
              >
                {submittingReturn ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
