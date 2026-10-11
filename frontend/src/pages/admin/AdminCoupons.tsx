import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, X, Power, Check } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { api } from '../../services/api';
import { Coupon } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 999,
    maxDiscountAmount: 500,
    firstOrderOnly: false
  });

  const { showToast } = useToast();

  const fetchCoupons = async () => {
    try {
      const res = await api.getAdminCoupons();
      if (res.success) setCoupons(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.discountValue) {
      showToast('Code and discount value are required.', 'error');
      return;
    }
    try {
      const res = await api.createAdminCoupon(form);
      if (res.success) {
        showToast('Coupon created successfully.', 'success');
        setModalOpen(false);
        fetchCoupons();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to create coupon.', 'error');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await api.toggleAdminCoupon(id);
      if (res.success) {
        showToast(res.message, 'success');
        fetchCoupons();
      }
    } catch (err: any) {
      showToast(err.message || 'Toggle failed.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await api.deleteAdminCoupon(id);
      showToast('Coupon deleted.', 'info');
      fetchCoupons();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete coupon.', 'error');
    }
  };

  return (
    <AdminLayout
      title="Coupons & Promotional Discount Engine"
      subtitle="Configure promo codes, minimum cart constraints, and seasonal discounts"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => {
              setForm({
                code: '',
                description: '',
                discountType: 'percentage',
                discountValue: 15,
                minOrderValue: 999,
                maxDiscountAmount: 600,
                firstOrderOnly: false
              });
              setModalOpen(true);
            }}
            className="bg-aura-accent hover:bg-aura-accentHover text-black px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Promo Coupon</span>
          </button>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-neutral-950 text-neutral-400 uppercase font-bold border-b border-neutral-800">
              <tr>
                <th className="p-3">Coupon Code</th>
                <th className="p-3">Discount Details</th>
                <th className="p-3">Min Order</th>
                <th className="p-3">Max Cap</th>
                <th className="p-3">First Order Rule</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-300">
              {coupons.map(c => (
                <tr key={c.id} className="hover:bg-neutral-800/40">
                  <td className="p-3 font-mono font-bold text-white text-sm tracking-wider">
                    {c.code}
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-aura-accent">
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                    </p>
                    <p className="text-[10px] text-neutral-400">{c.description}</p>
                  </td>
                  <td className="p-3 font-semibold text-white">₹{c.minOrderValue}</td>
                  <td className="p-3 text-neutral-400">{c.maxDiscountAmount ? `₹${c.maxDiscountAmount}` : 'Unlimited'}</td>
                  <td className="p-3">
                    {c.firstOrderOnly ? (
                      <span className="text-amber-400 font-semibold">First-Time Shoppers Only</span>
                    ) : (
                      <span className="text-neutral-500">All Customers</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                      c.isActive
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleToggle(c.id)}
                      className="p-1.5 text-neutral-400 hover:text-white"
                      title="Toggle Active State"
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-400"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-700 w-full max-w-md p-6 space-y-4 text-xs shadow-2xl text-white">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-bold uppercase tracking-wider text-white">Create New Coupon</h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block font-bold uppercase text-neutral-400 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SEOUL25"
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 outline-none font-mono font-bold focus:border-aura-accent"
                  required
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-400 mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Flat 15% discount for festival weekend"
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-neutral-400 mb-1">Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={e => setForm({ ...form, discountType: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                    <option value="shipping">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-neutral-400 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    value={form.discountValue}
                    onChange={e => setForm({ ...form, discountValue: parseFloat(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-neutral-400 mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={form.minOrderValue}
                    onChange={e => setForm({ ...form, minOrderValue: parseFloat(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-neutral-400 mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={form.maxDiscountAmount}
                    onChange={e => setForm({ ...form, maxDiscountAmount: parseFloat(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center space-x-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.firstOrderOnly}
                  onChange={e => setForm({ ...form, firstOrderOnly: e.target.checked })}
                />
                <span className="font-semibold text-neutral-300">Valid on First-Time Shoppers Only</span>
              </label>

              <div className="pt-3 flex justify-end space-x-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="border border-neutral-700 px-4 py-2 font-bold uppercase text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-aura-accent text-black px-5 py-2 font-bold uppercase hover:bg-aura-accentHover"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
