import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  AlertCircle,
  RotateCcw,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const OrderTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialOrderNumber = searchParams.get('orderNumber') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [emailOrPhone, setEmailOrPhone] = useState('customer@auraseoul.com');
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<any | null>(null);
  const { showToast } = useToast();

  const handleTrackSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderNumber.trim() || !emailOrPhone.trim()) {
      showToast('Please enter both Order Number and registered Email/Phone.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.trackOrder(orderNumber.trim(), emailOrPhone.trim());
      if (res.success && res.data) {
        setTrackingData(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'No matching order found.', 'error');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      handleTrackSubmit();
    }
  }, [initialOrderNumber]);

  const pipelineSteps = [
    'Order Placed',
    'Payment Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];

  const getCurrentStepIndex = (status: string) => {
    return pipelineSteps.indexOf(status);
  };

  const isCancelled = trackingData?.status === 'Cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-aura-accent">
          REAL-TIME SHIPMENT TRACKING
        </span>
        <h1 className="text-3xl font-black font-display uppercase tracking-tight text-aura-black">
          Track Your Order
        </h1>
        <p className="text-xs text-neutral-500 max-w-md mx-auto">
          Enter your unique Aura Seoul order number and verification email or mobile number below to track dispatch progress.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-sm max-w-2xl mx-auto">
        <form onSubmit={handleTrackSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Order Number
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value)}
                placeholder="e.g. AURA-2603-9182"
                className="w-full border border-neutral-300 p-3 font-bold uppercase outline-none focus:border-aura-black"
                required
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Email or Mobile Number
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={e => setEmailOrPhone(e.target.value)}
                placeholder="customer@auraseoul.com"
                className="w-full border border-neutral-300 p-3 outline-none focus:border-aura-black"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <span className="text-[11px] text-neutral-400">
              Demo Test Order: <strong>AURA-2603-9182</strong>
            </span>

            <button
              type="submit"
              disabled={loading}
              className="bg-aura-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center space-x-2"
            >
              <Truck className="w-4 h-4" />
              <span>{loading ? 'Tracking...' : 'Track Shipment'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Tracking Results View */}
      {trackingData && (
        <div className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-8 animate-fadeIn shadow-sm">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Shipment Details</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-aura-black">
                Order #{trackingData.orderNumber}
              </h2>
              <p className="text-xs text-neutral-500">
                Courier: <strong>{trackingData.trackingCarrier}</strong> • AWB: <strong className="text-aura-accent">{trackingData.trackingNumber}</strong>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                isCancelled
                  ? 'bg-red-100 text-red-700'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {trackingData.status}
              </span>
              <p className="text-xs text-neutral-500 mt-1">
                Estimated Delivery: <strong>{trackingData.estimatedDeliveryDate}</strong>
              </p>
            </div>
          </div>

          {/* Visual Progress Stepper Bar */}
          {!isCancelled ? (
            <div className="py-4">
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-4 left-0 right-0 h-1 bg-neutral-200 -z-0" />
                <div
                  className="absolute top-4 left-0 h-1 bg-aura-black transition-all duration-500 -z-0"
                  style={{
                    width: `${Math.max(0, (getCurrentStepIndex(trackingData.status) / (pipelineSteps.length - 1)) * 100)}%`
                  }}
                />

                <div className="flex justify-between relative z-10">
                  {pipelineSteps.map((stepName, idx) => {
                    const currentIdx = getCurrentStepIndex(trackingData.status);
                    const isDone = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-aura-accent text-black ring-4 ring-aura-accent/30 scale-110'
                              : isDone
                              ? 'bg-aura-black text-white'
                              : 'bg-white border-2 border-neutral-300 text-neutral-400'
                          }`}
                        >
                          {isDone ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={`text-[10px] sm:text-xs uppercase font-bold tracking-wider mt-2 text-center max-w-[80px] ${
                          isDone ? 'text-aura-black' : 'text-neutral-400'
                        }`}>
                          {stepName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 p-4 text-xs text-red-700 flex items-center space-x-2">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <span>This order was cancelled. Inventory was restored and refund initiated.</span>
            </div>
          )}

          {/* Milestones & Status History Log */}
          {trackingData.statusHistory && trackingData.statusHistory.length > 0 && (
            <div className="pt-6 border-t border-neutral-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-aura-black mb-4 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-aura-accent" />
                <span>Status Update History</span>
              </h3>

              <div className="space-y-4 text-xs pl-2 border-l-2 border-neutral-200">
                {trackingData.statusHistory.map((h: any, i: number) => (
                  <div key={i} className="relative pl-4 space-y-0.5">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-aura-black border-2 border-white" />
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-aura-black">{h.status}</span>
                      <span className="text-[10px] text-neutral-400">
                        {new Date(h.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {h.note && <p className="text-neutral-500">{h.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ordered Items Preview */}
          <div className="pt-6 border-t border-neutral-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-aura-black mb-3">
              Shipment Contents ({trackingData.items?.length} items)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {trackingData.items?.map((it: any, idx: number) => (
                <div key={idx} className="flex items-center space-x-3 p-2 bg-neutral-50 border border-neutral-200">
                  <img src={it.image} alt={it.name} className="w-12 h-14 object-cover flex-shrink-0" />
                  <div className="truncate">
                    <p className="font-bold text-aura-black truncate">{it.name}</p>
                    <p className="text-neutral-500 text-[11px]">{it.size} • {it.color} • Qty: {it.quantity}</p>
                    <p className="font-semibold text-aura-black mt-0.5">₹{it.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
