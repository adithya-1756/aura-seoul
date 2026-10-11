import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, FolderTree } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { api } from '../../services/api';
import { Category } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    displayOrder: 1
  });

  const { showToast } = useToast();

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories();
      if (res.success) setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCat(null);
    setForm({
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      displayOrder: categories.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCat(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || '',
      displayOrder: cat.displayOrder || 1
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      showToast('Category name is required.', 'error');
      return;
    }
    try {
      if (editingCat) {
        const res = await api.updateAdminCategory(editingCat.id, form);
        if (res.success) showToast('Category updated.', 'success');
      } else {
        const res = await api.createAdminCategory(form);
        if (res.success) showToast('Category created.', 'success');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      showToast(err.message || 'Operation failed.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this category?')) return;
    try {
      await api.deleteAdminCategory(id);
      showToast('Category removed.', 'info');
      fetchCategories();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete.', 'error');
    }
  };

  return (
    <AdminLayout
      title="Category & Collection Taxonomy"
      subtitle="Organize clothing types, menu hierarchy, and category display images"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            onClick={openAddModal}
            className="bg-aura-accent hover:bg-aura-accentHover text-black px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-neutral-950 text-neutral-400 uppercase font-bold border-b border-neutral-800">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Category Name</th>
                <th className="p-3">Slug / URL</th>
                <th className="p-3">Products</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-300">
              {categories.map(c => (
                <tr key={c.id} className="hover:bg-neutral-800/40">
                  <td className="p-3 font-mono text-neutral-500">{c.displayOrder}</td>
                  <td className="p-3 flex items-center space-x-3">
                    <img src={c.image} alt="" className="w-9 h-12 object-cover flex-shrink-0" />
                    <span className="font-bold text-white">{c.name}</span>
                  </td>
                  <td className="p-3 font-mono text-aura-accent">/category/{c.slug}</td>
                  <td className="p-3 font-bold text-neutral-300">{c.productCount || 0}</td>
                  <td className="p-3 text-neutral-400 truncate max-w-xs">{c.description}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-1.5 text-neutral-400 hover:text-white"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-700 w-full max-w-md p-6 space-y-4 text-xs shadow-2xl text-white">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-bold uppercase tracking-wider text-white">
                {editingCat ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-bold uppercase text-neutral-400 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Parachute Cargos"
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 outline-none focus:border-aura-accent"
                  required
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-400 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. cargo-pants"
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-400 mb-1">Banner Image URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 p-2.5 outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
