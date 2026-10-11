import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, Check, Search } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminInventory: React.FC = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stockInputs, setStockInputs] = useState<Record<string, number>>({});
  const { showToast } = useToast();

  const fetchInventory = async () => {
    try {
      const res = await api.getAdminInventory();
      if (res.success) {
        setInventory(res.data || []);
        const initial: Record<string, number> = {};
        (res.data || []).forEach((item: any) => {
          initial[`${item.productId}-${item.size}-${item.color}`] = item.stock;
        });
        setStockInputs(initial);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdateStock = async (item: any) => {
    const key = `${item.productId}-${item.size}-${item.color}`;
    const newStock = stockInputs[key];
    try {
      const res = await api.updateAdminStock({
        productId: item.productId,
        size: item.size,
        color: item.color,
        newStock
      });
      if (res.success) {
        showToast(`Stock updated for ${item.productName} (${item.size}) to ${newStock} units.`, 'success');
        fetchInventory();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update stock.', 'error');
    }
  };

  const filtered = inventory.filter(it =>
    it.productName.toLowerCase().includes(search.toLowerCase()) ||
    it.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Variant Inventory & Warehouse Stock"
      subtitle="Monitor stock quantities per size/color variant and prevent overselling"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search SKU or Garment..."
              className="w-full bg-neutral-900 border border-neutral-800 pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-aura-accent"
            />
          </div>

          <span className="text-xs text-neutral-400 font-bold uppercase">
            Total Variants Tracked: {inventory.length}
          </span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-neutral-950 text-neutral-400 uppercase font-bold border-b border-neutral-800">
              <tr>
                <th className="p-3">Garment & SKU</th>
                <th className="p-3">Size</th>
                <th className="p-3">Color</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">Health Status</th>
                <th className="p-3 text-right">Quick Stock Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-300">
              {filtered.map((item, idx) => {
                const key = `${item.productId}-${item.size}-${item.color}`;
                const isLow = item.stock <= 10;
                return (
                  <tr key={idx} className="hover:bg-neutral-800/40">
                    <td className="p-3 flex items-center space-x-3">
                      <img src={item.image} alt="" className="w-8 h-10 object-cover flex-shrink-0" />
                      <div>
                        <p className="font-bold text-white line-clamp-1">{item.productName}</p>
                        <p className="font-mono text-[10px] text-neutral-400">{item.sku}</p>
                      </div>
                    </td>
                    <td className="p-3 font-bold text-white">{item.size}</td>
                    <td className="p-3">{item.color}</td>
                    <td className="p-3 font-mono font-bold text-white">{item.stock} units</td>
                    <td className="p-3">
                      {isLow ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-bold uppercase bg-red-950 text-red-400 border border-red-800">
                          <AlertTriangle className="w-3 h-3 mr-0.5" />
                          <span>Low Stock Alert</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                          <span>Healthy</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center space-x-2">
                        <input
                          type="number"
                          value={stockInputs[key] ?? item.stock}
                          onChange={e => setStockInputs({ ...stockInputs, [key]: parseInt(e.target.value) || 0 })}
                          className="w-16 bg-neutral-950 border border-neutral-700 px-2 py-1 text-right text-xs text-white outline-none focus:border-aura-accent"
                        />
                        <button
                          onClick={() => handleUpdateStock(item)}
                          className="bg-aura-accent hover:bg-aura-accentHover text-black px-2.5 py-1 text-[11px] font-bold uppercase transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
