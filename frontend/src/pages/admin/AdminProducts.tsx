import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Search } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { api } from '../../services/api';
import { Product, Category } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: 1999,
    originalPrice: 2499,
    categoryId: 'cat-tshirts',
    style: 'Korean Streetwear',
    gender: 'Unisex',
    fabric: '100% Combed Heavy Cotton (260 GSM)',
    fit: 'Oversized Boxy Silhouette',
    careInstructions: 'Machine wash cold.',
    images: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    sizes: 'S, M, L, XL',
    colors: 'Vintage Washed Black, Charcoal, Oatmeal',
    isNewArrival: true,
    isBestSeller: false,
    isTrending: false,
    isOnSale: true
  });

  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts({ limit: 100 }),
        api.getCategories()
      ]);
      if (prodRes.success) setProducts(prodRes.data || []);
      if (catRes.success) setCategories(catRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      description: '',
      shortDescription: '',
      price: 1999,
      originalPrice: 2499,
      categoryId: categories[0]?.id || 'cat-tshirts',
      style: 'Korean Streetwear',
      gender: 'Unisex',
      fabric: '100% Combed Heavy Cotton (260 GSM)',
      fit: 'Oversized Boxy Silhouette',
      careInstructions: 'Machine wash cold.',
      images: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      sizes: 'S, M, L, XL',
      colors: 'Vintage Washed Black, Charcoal',
      isNewArrival: true,
      isBestSeller: false,
      isTrending: false,
      isOnSale: false
    });
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      description: p.description,
      shortDescription: p.shortDescription || '',
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      categoryId: p.categoryId,
      style: p.style,
      gender: p.gender,
      fabric: p.fabric,
      fit: p.fit,
      careInstructions: p.careInstructions || '',
      images: p.images.join(', '),
      sizes: p.sizes.join(', '),
      colors: p.colors.map(c => c.name).join(', '),
      isNewArrival: Boolean(p.isNewArrival),
      isBestSeller: Boolean(p.isBestSeller),
      isTrending: Boolean(p.isTrending),
      isOnSale: Boolean(p.isOnSale)
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      showToast('Name and price are required.', 'error');
      return;
    }

    const payload = {
      ...form,
      images: form.images.split(',').map(s => s.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editingProduct) {
        const res = await api.updateAdminProduct(editingProduct.id, payload);
        if (res.success) showToast('Product updated successfully.', 'success');
      } else {
        const res = await api.createAdminProduct(payload);
        if (res.success) showToast('New garment added to store.', 'success');
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Operation failed.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteAdminProduct(id);
      showToast('Product deleted.', 'info');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete.', 'error');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.style.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Catalogue & Product Management"
      subtitle="Create, update, and manage garments, imagery, pricing, and variants"
    >
      <div className="space-y-6">
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter products..."
              className="w-full bg-neutral-900 border border-neutral-800 pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-aura-accent"
            />
          </div>

          <button
            onClick={openAddModal}
            className="w-full sm:w-auto bg-aura-accent hover:bg-aura-accentHover text-black px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Garment</span>
          </button>
        </div>

        {/* Product Roster Table */}
        <div className="bg-neutral-900 border border-neutral-800 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-neutral-950 text-neutral-400 uppercase font-bold border-b border-neutral-800">
              <tr>
                <th className="p-3">Garment</th>
                <th className="p-3">Style & Gender</th>
                <th className="p-3">Price</th>
                <th className="p-3">Discount</th>
                <th className="p-3">Sizes</th>
                <th className="p-3">Badges</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-300">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="p-3 flex items-center space-x-3">
                    <img src={p.images?.[0]} alt="" className="w-10 h-12 object-cover flex-shrink-0" />
                    <div>
                      <p className="font-bold text-white line-clamp-1">{p.name}</p>
                      <p className="text-[10px] text-neutral-400 font-mono">ID: {p.id}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-neutral-200">{p.style}</p>
                    <p className="text-[10px] text-neutral-400">{p.gender}</p>
                  </td>
                  <td className="p-3 font-bold text-white">₹{p.price}</td>
                  <td className="p-3">
                    {p.discountPercent ? `${p.discountPercent}% OFF` : 'Full Price'}
                  </td>
                  <td className="p-3">{p.sizes?.join(', ')}</td>
                  <td className="p-3 space-x-1">
                    {p.isNewArrival && <span className="px-1.5 py-0.5 text-[9px] bg-neutral-800 text-white font-bold uppercase">New</span>}
                    {p.isBestSeller && <span className="px-1.5 py-0.5 text-[9px] bg-amber-950 text-amber-300 font-bold uppercase">Best</span>}
                    {p.isOnSale && <span className="px-1.5 py-0.5 text-[9px] bg-red-950 text-red-300 font-bold uppercase">Sale</span>}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 text-neutral-400 hover:text-white"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-400"
                      title="Delete"
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

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-white shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
                {editingProduct ? 'Edit Garment Details' : 'Add New Garment to Catalog'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-neutral-400 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Hongdae Heavyweight Boxy Zip Hoodie"
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white outline-none focus:border-aura-accent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-neutral-400 mb-1">Selling Price (INR ₹) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white outline-none focus:border-aura-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-neutral-400 mb-1">Original Price (INR ₹)</label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={e => setForm({ ...form, originalPrice: parseFloat(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white outline-none focus:border-aura-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold uppercase text-neutral-400 mb-1">Category</label>
                  <select
                    value={form.categoryId}
                    onChange={e => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-neutral-400 mb-1">Style Aesthetic</label>
                  <select
                    value={form.style}
                    onChange={e => setForm({ ...form, style: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white outline-none"
                  >
                    <option value="Korean Streetwear">Korean Streetwear</option>
                    <option value="Y2K Fashion">Y2K Fashion</option>
                    <option value="Minimalist Style">Minimalist Style</option>
                    <option value="Casual Everyday Wear">Casual Everyday Wear</option>
                    <option value="College Fits">College Fits</option>
                    <option value="Party Wear">Party Wear</option>
                    <option value="Ethnic and Traditional Wear">Ethnic and Traditional Wear</option>
                    <option value="Athleisure">Athleisure</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-neutral-400 mb-1">Gender</label>
                  <select
                    value={form.gender}
                    onChange={e => setForm({ ...form, gender: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white outline-none"
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-400 mb-1">Image URLs (comma separated)</label>
                <input
                  type="text"
                  value={form.images}
                  onChange={e => setForm({ ...form, images: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white outline-none focus:border-aura-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-neutral-400 mb-1">Available Sizes (comma separated)</label>
                  <input
                    type="text"
                    value={form.sizes}
                    onChange={e => setForm({ ...form, sizes: e.target.value })}
                    placeholder="S, M, L, XL"
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-neutral-400 mb-1">Colors (comma separated)</label>
                  <input
                    type="text"
                    value={form.colors}
                    onChange={e => setForm({ ...form, colors: e.target.value })}
                    placeholder="Black, Sage Green, Oatmeal"
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-400 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-white outline-none focus:border-aura-accent"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.isNewArrival}
                    onChange={e => setForm({ ...form, isNewArrival: e.target.checked })}
                  />
                  <span>New Drop Badge</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.isBestSeller}
                    onChange={e => setForm({ ...form, isBestSeller: e.target.checked })}
                  />
                  <span>Best Seller Badge</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.isTrending}
                    onChange={e => setForm({ ...form, isTrending: e.target.checked })}
                  />
                  <span>Trending Badge</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="border border-neutral-700 px-4 py-2 uppercase font-bold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-aura-accent text-black px-6 py-2 uppercase font-bold hover:bg-aura-accentHover"
                >
                  Save Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
