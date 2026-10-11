import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Boxes,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Clock
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { api } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminMetrics().then(res => {
      if (res.success) setMetrics(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <AdminLayout
      title="Store Performance & Metrics"
      subtitle="Real-time operational overview of Aura Seoul atelier operations"
    >
      {loading ? (
        <div className="py-24 text-center text-xs text-neutral-500 uppercase tracking-widest">
          Loading store analytics...
        </div>
      ) : (
        <div className="space-y-8">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-neutral-900 border border-neutral-800 p-5 space-y-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] uppercase font-bold tracking-wider">Gross Sales</span>
                <DollarSign className="w-4 h-4 text-aura-accent" />
              </div>
              <p className="text-2xl font-black font-display text-white">₹{metrics?.totalSales?.toLocaleString()}</p>
              <p className="text-[10px] text-emerald-400 font-semibold">+18.4% from last drop</p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-5 space-y-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] uppercase font-bold tracking-wider">Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-aura-accent" />
              </div>
              <p className="text-2xl font-black font-display text-white">{metrics?.totalOrders}</p>
              <p className="text-[10px] text-amber-400 font-semibold">{metrics?.pendingOrders} Pending Fulfillment</p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-5 space-y-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] uppercase font-bold tracking-wider">Customers</span>
                <Users className="w-4 h-4 text-aura-accent" />
              </div>
              <p className="text-2xl font-black font-display text-white">{metrics?.totalCustomers}</p>
              <p className="text-[10px] text-neutral-400">Registered Wardrobes</p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-5 space-y-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] uppercase font-bold tracking-wider">Catalogue Items</span>
                <Boxes className="w-4 h-4 text-aura-accent" />
              </div>
              <p className="text-2xl font-black font-display text-white">{metrics?.totalProducts}</p>
              <p className="text-[10px] text-red-400 font-semibold">{metrics?.lowStockCount} Low-Stock Variants</p>
            </div>
          </div>

          {/* Sales Chart & Low Stock Alerts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Visual Sales Trend Bar Chart (8 cols) */}
            <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Monthly Sales Volume</h3>
                  <p className="text-xs text-neutral-400">Revenue performance over recent drops</p>
                </div>
                <span className="text-xs font-bold text-aura-accent">INR (₹)</span>
              </div>

              {/* Bar Chart Representation */}
              <div className="flex items-end justify-between h-48 pt-6 px-4 gap-4">
                {metrics?.monthlySales?.map((m: any, idx: number) => {
                  const maxSale = 150000;
                  const heightPercent = Math.min(100, Math.round((m.sales / maxSale) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[10px] font-bold text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        ₹{(m.sales / 1000).toFixed(0)}k
                      </span>
                      <div className="w-full bg-neutral-800 h-36 flex items-end">
                        <div
                          className="w-full bg-aura-accent group-hover:bg-aura-accentHover transition-all duration-500"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-neutral-300">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Low Stock Alerts (4 cols) */}
            <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center space-x-2 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Low Stock Alerts</h3>
                </div>
                <Link to="/admin/inventory" className="text-xs text-aura-accent hover:underline">
                  Manage All
                </Link>
              </div>

              <div className="space-y-3 max-h-56 overflow-y-auto text-xs pr-1">
                {metrics?.lowStockItems?.map((it: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-neutral-950 border border-neutral-800">
                    <div className="truncate mr-2">
                      <p className="font-bold text-white truncate">{it.productName}</p>
                      <p className="text-[10px] text-neutral-400">{it.size} • {it.color}</p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-red-950 text-red-400 border border-red-800">
                      {it.stock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Recent Customer Orders</h3>
              <Link to="/admin/orders" className="text-xs text-aura-accent hover:underline flex items-center space-x-1">
                <span>View Full Order Roster</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-neutral-950 text-neutral-400 uppercase font-bold border-b border-neutral-800">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Fulfillment Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  {metrics?.recentOrders?.map((ord: any) => (
                    <tr key={ord.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-white">
                        <Link to={`/admin/orders`} className="hover:text-aura-accent">
                          {ord.orderNumber}
                        </Link>
                      </td>
                      <td className="p-3">{ord.contact?.name || ord.shippingAddress?.fullName}</td>
                      <td className="p-3 font-bold text-white">₹{ord.totalAmount}</td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold text-neutral-400 bg-neutral-800 px-2 py-0.5">
                          {ord.paymentMethod}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : ord.status === 'Cancelled'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3 text-neutral-400">{new Date(ord.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
