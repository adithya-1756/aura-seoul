import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, ChevronRight, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';

export const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyOrders().then(res => {
      if (res.success) setOrders(res.data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
      case 'Payment Confirmed':
      case 'Order Placed':
        return 'bg-amber-100 text-amber-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-neutral-400 uppercase tracking-widest">
        <Link to="/" className="hover:text-aura-black">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/account" className="hover:text-aura-black">Account</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-aura-black font-semibold">Order History</span>
      </div>

      <div className="border-b border-neutral-200 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-aura-black">
            Order History ({orders.length})
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Review past purchases, download invoices, track dispatches, and manage returns.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-xs text-neutral-400 uppercase tracking-widest">
          Loading order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-neutral-300 p-8 space-y-4 max-w-md mx-auto">
          <Package className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-lg font-bold font-display uppercase tracking-wider text-aura-black">
            No Orders Placed Yet
          </h3>
          <p className="text-xs text-neutral-500">
            When you purchase clothing items from our drops, your order confirmations and tracking history will appear here.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-aura-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white border border-neutral-200 shadow-sm overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Order Placed</span>
                    <span className="font-semibold text-aura-black">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Total</span>
                    <span className="font-bold text-aura-black">₹{order.totalAmount}</span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Ship To</span>
                    <span className="text-neutral-700 truncate max-w-[150px] inline-block">{order.shippingAddress?.fullName}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-neutral-400 font-mono text-[11px]">#{order.orderNumber}</span>
                </div>
              </div>

              {/* Items List inside card */}
              <div className="p-6 divide-y divide-neutral-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-4">
                      <img src={item.image} alt={item.name} className="w-14 h-16 object-cover flex-shrink-0" />
                      <div>
                        <Link
                          to={`/product/${item.slug || item.productId}`}
                          className="font-bold text-aura-black hover:text-aura-accent line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-neutral-500 text-[11px] mt-0.5">
                          Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                        </p>
                        <p className="font-semibold text-aura-black mt-1">₹{item.price * item.quantity}</p>
                      </div>
                    </div>

                    <Link
                      to={`/product/${item.slug || item.productId}`}
                      className="border border-neutral-300 hover:border-aura-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-aura-black transition-colors"
                    >
                      Buy Again
                    </Link>
                  </div>
                ))}
              </div>

              {/* Card Footer Actions */}
              <div className="bg-neutral-50/50 px-6 py-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2 text-neutral-500">
                  <Truck className="w-4 h-4 text-aura-accent" />
                  <span>Carrier: {order.trackingCarrier} (AWB: {order.trackingNumber})</span>
                </div>

                <div className="flex items-center space-x-3">
                  <Link
                    to={`/account/orders/${order.orderNumber || order.id}`}
                    className="font-bold text-aura-black hover:text-aura-accent flex items-center space-x-1"
                  >
                    <span>View Order Details & Invoice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to={`/order-tracking?orderNumber=${order.orderNumber}`}
                    className="bg-aura-black hover:bg-neutral-800 text-white px-4 py-1.5 font-bold uppercase tracking-wider text-[11px] transition-colors"
                  >
                    Track Package
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
