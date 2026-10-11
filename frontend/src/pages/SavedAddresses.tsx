import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Check,
  ChevronRight,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { Address } from '../types';
import { useToast } from '../context/ToastContext';

export const SavedAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    houseDetails: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
    isDefault: false,
    deliveryInstructions: ''
  });

  const { showToast } = useToast();

  const fetchAddresses = async () => {
    try {
      const res = await api.getAddresses();
      if (res.success) setAddresses(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      fullName: '',
      phone: '',
      houseDetails: '',
      street: '',
      city: '',
      state: '',
      pinCode: '',
      country: 'India',
      isDefault: addresses.length === 0,
      deliveryInstructions: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingId(addr.id);
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      houseDetails: addr.houseDetails,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pinCode: addr.pinCode,
      country: addr.country,
      isDefault: Boolean(addr.isDefault),
      deliveryInstructions: addr.deliveryInstructions || ''
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!pinRegex.test(form.pinCode.trim())) {
      showToast('Please enter a valid 6-digit Indian PIN code.', 'error');
      return;
    }

    try {
      if (editingId) {
        const res = await api.updateAddress(editingId, form);
        if (res.success) showToast('Address updated.', 'success');
      } else {
        const res = await api.addAddress(form);
        if (res.success) showToast('New address saved.', 'success');
      }
      setModalOpen(false);
      fetchAddresses();
    } catch (err: any) {
      showToast(err.message || 'Failed to save address.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this address?')) return;
    try {
      await api.deleteAddress(id);
      showToast('Address removed.', 'info');
      fetchAddresses();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete address.', 'error');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.setDefaultAddress(id);
      showToast('Default address updated.', 'success');
      fetchAddresses();
    } catch (err: any) {
      showToast(err.message || 'Failed to update default address.', 'error');
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
        <span className="text-aura-black font-semibold">Saved Addresses</span>
      </div>

      <div className="border-b border-neutral-200 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-aura-black">
            Saved Delivery Addresses
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage your doorstep shipping locations across India.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-aura-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Address</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-neutral-400 uppercase tracking-widest">
          Loading addresses...
        </div>
      ) : addresses.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-neutral-300 p-8 space-y-3">
          <MapPin className="w-8 h-8 text-neutral-400 mx-auto" />
          <p className="text-sm font-bold text-aura-black">No saved addresses found</p>
          <p className="text-xs text-neutral-500">Save your home, office, or studio address for rapid checkout.</p>
          <button
            onClick={openAddModal}
            className="bg-aura-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
          >
            Add First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map(addr => (
            <div
              key={addr.id}
              className={`p-6 bg-white border transition-all flex flex-col justify-between ${
                addr.isDefault ? 'border-aura-black shadow-sm ring-1 ring-aura-black/20' : 'border-neutral-200'
              }`}
            >
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-aura-black">{addr.fullName}</span>
                  {addr.isDefault ? (
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-aura-black text-white">
                      Default
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-[11px] text-neutral-500 hover:text-aura-black underline"
                    >
                      Set as Default
                    </button>
                  )}
                </div>

                <p className="text-neutral-700">{addr.houseDetails}</p>
                {addr.street && <p className="text-neutral-600">{addr.street}</p>}
                <p className="text-neutral-700 font-semibold">{addr.city}, {addr.state} - {addr.pinCode}</p>
                <p className="text-neutral-500">Phone: {addr.phone}</p>
                {addr.deliveryInstructions && (
                  <p className="text-[11px] text-neutral-400 italic">Instructions: "{addr.deliveryInstructions}"</p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-end space-x-3 text-xs">
                <button
                  onClick={() => openEditModal(addr)}
                  className="text-neutral-600 hover:text-aura-black font-semibold flex items-center space-x-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-neutral-400 hover:text-red-600 flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-neutral-200 bg-neutral-50">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-aura-black">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-neutral-400 hover:text-aura-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                    required
                    className="w-full border border-neutral-300 p-2.5 outline-none focus:border-aura-black"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    required
                    className="w-full border border-neutral-300 p-2.5 outline-none focus:border-aura-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">Flat / Building / House</label>
                <input
                  type="text"
                  value={form.houseDetails}
                  onChange={e => setForm({ ...form, houseDetails: e.target.value })}
                  required
                  placeholder="e.g. Flat 304, Green Heights"
                  className="w-full border border-neutral-300 p-2.5 outline-none focus:border-aura-black"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    required
                    className="w-full border border-neutral-300 p-2.5 outline-none focus:border-aura-black"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">State</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={e => setForm({ ...form, state: e.target.value })}
                    required
                    className="w-full border border-neutral-300 p-2.5 outline-none focus:border-aura-black"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">PIN Code (6 digits)</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={form.pinCode}
                    onChange={e => setForm({ ...form, pinCode: e.target.value.replace(/\D/g, '') })}
                    required
                    className="w-full border border-neutral-300 p-2.5 outline-none focus:border-aura-black font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-neutral-600 mb-1">Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  value={form.deliveryInstructions}
                  onChange={e => setForm({ ...form, deliveryInstructions: e.target.value })}
                  placeholder="e.g. Leave with security if unavailable"
                  className="w-full border border-neutral-300 p-2.5 outline-none focus:border-aura-black"
                />
              </div>

              <label className="flex items-center space-x-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={e => setForm({ ...form, isDefault: e.target.checked })}
                />
                <span className="font-semibold text-aura-black">Set as default delivery address</span>
              </label>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="border border-neutral-300 px-5 py-2.5 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-aura-black text-white px-6 py-2.5 text-xs font-bold uppercase hover:bg-neutral-800"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
