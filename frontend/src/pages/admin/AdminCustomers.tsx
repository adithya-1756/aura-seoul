import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, ShoppingBag, DollarSign } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { api } from '../../services/api';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminCustomers().then(res => {
      if (res.success) setCustomers(res.data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <AdminLayout
      title="Registered Shoppers & Customer Roster"
      subtitle="View customer accounts, lifetime spending volume, and order frequencies"
    >
      <div className="space-y-6">
        <div className="bg-neutral-900 border border-neutral-800 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-neutral-950 text-neutral-400 uppercase font-bold border-b border-neutral-800">
              <tr>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Orders Count</th>
                <th className="p-3">Lifetime Spend</th>
                <th className="p-3">Registered Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-300">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-neutral-800/40">
                  <td className="p-3 font-bold text-white">{c.name}</td>
                  <td className="p-3 text-neutral-400 font-mono">{c.email}</td>
                  <td className="p-3 text-neutral-400">{c.phone || 'N/A'}</td>
                  <td className="p-3 font-semibold text-white">{c.orderCount} orders</td>
                  <td className="p-3 font-bold text-aura-accent">₹{c.totalSpend?.toLocaleString() || 0}</td>
                  <td className="p-3 text-neutral-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
