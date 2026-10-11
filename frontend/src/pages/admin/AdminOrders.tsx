import React, { useState, useEffect } from 'react';
import { Search, Eye, Truck, CheckCircle, X, Clock, Edit2 } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { api } from '../../services/api';
import { Order } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status update form
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [targetOrder, setTargetOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingCarrier, setTrackingCarrier] = useState('Delhivery Express');
  const [statusNote, setStatusNote] = useState('');

  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const res = await api.getAdminOrders(params);
      if (res.success) setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const openStatusModal = (ord: Order) => {
    setTargetOrder(ord);
    setNewStatus(ord.status);
    setTrackingNumber(ord.trackingNumber || '');
    setTrackingCarrier(ord.trackingCarrier || 'Delhivery Express');
    setStatusNote('');
    setUpdateModalOpen(true);
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetOrder || !newStatus) return;

    try {
      const res = await api.updateOrderStatus(targetOrder.id, {
        status: newStatus,
        trackingNumber,
        trackingCarrier,
        note: statusNote
      });
      if (res.success) {
        showToast(res.message, 'success');
        setUpdateModalOpen(false);
        fetchOrders();
      }
    } catch (err: any) {
      showToast(err.message || 'Status update failed.', 'error');
    }
  };

  return (
    <AdminLayout
      title="Order Fulfillment & Dispatch Hub"
      subtitle="Track customer shipments, process package dispatches, and update delivery milestones"
    >
      <div className="space-y-6">
        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search order #, customer, email..."
              className="w-full bg-neutral-900 border border-neutral-800 pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-aura-accent"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs text-neutral-400 font-bold uppercase">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 text-xs text-white px-3 py-2 outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Payment Confirmed">Payment Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-neutral-900 border border-neutral-800 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-neutral-950 text-neutral-400 uppercase font-bold border-b border-neutral-800">
              <tr>
                <th className="p-3">Order Number</th>
                <th className="p-3">Customer & Contact</th>
                <th className="p-3">Garments</th>
                <th className="p-3">Total (INR)</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Fulfillment Status</th>
                <th className="p-3">Courier AWB</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-300">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-neutral-800/40">
                  <td className="p-3 font-mono font-bold text-white">{o.orderNumber}</td>
                  <td className="p-3">
                    <p className="font-semibold text-white">{o.contact?.name || o.shippingAddress?.fullName}</p>
                    <p className="text-[10px] text-neutral-400">{o.contact?.email}</p>
                    <p className="text-[10px] text-neutral-400">{o.contact?.phone}</p>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{o.items.length} items</span>
                    <p className="text-[10px] text-neutral-400 truncate max-w-[150px]">
                      {o.items.map(it => it.name).join(', ')}
                    </p>
                  </td>
                  <td className="p-3 font-bold text-white">₹{o.totalAmount}</td>
                  <td className="p-3">
                    <span className="text-[10px] font-bold text-neutral-300 bg-neutral-800 px-2 py-0.5">
                      {o.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                      o.status === 'Delivered'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : o.status === 'Cancelled'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : o.status === 'Shipped'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-aura-accent">
                    {o.trackingNumber || 'Pending'}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => openStatusModal(o)}
                      className="bg-neutral-800 hover:bg-neutral-700 text-white px-2.5 py-1 text-[11px] font-semibold uppercase"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Modal */}
      {updateModalOpen && targetOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-700 w-full max-w-md p-6 space-y-4 text-xs shadow-2xl text-white">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-bold uppercase tracking-wider text-white">
                Update Fulfillment: #{targetOrder.orderNumber}
              </h3>
              <button onClick={() => setUpdateModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block font-bold uppercase text-neutral-400 mb-1">Fulfillment Status</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white outline-none focus:border-aura-accent"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Payment Confirmed">Payment Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-400 mb-1">Courier Carrier</label>
                <input
                  type="text"
                  value={trackingCarrier}
                  onChange={e => setTrackingCarrier(e.target.value)}
                  placeholder="Delhivery Express / BlueDart"
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-400 mb-1">Tracking Number / AWB</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  placeholder="DELHIVERY-AWB-XXXX"
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-400 mb-1">Milestone Note (Optional)</label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={e => setStatusNote(e.target.value)}
                  placeholder="e.g. Scanned at regional distribution sorting center"
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setUpdateModalOpen(false)}
                  className="border border-neutral-700 px-4 py-2 font-bold uppercase text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-aura-accent text-black px-5 py-2 font-bold uppercase hover:bg-aura-accentHover"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
