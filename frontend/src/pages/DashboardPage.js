import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

const StatCard = ({ label, value, icon, color, sub }) => (
  <div className="card p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(({ data }) => setStats(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const { totalOrders, totalRevenue, todayOrders, todayRevenue, statusBreakdown, last7Days } = stats || {};

  const statusCards = [
    { status: 'RECEIVED', count: statusBreakdown?.RECEIVED || 0, icon: '📥', color: 'bg-blue-50' },
    { status: 'PROCESSING', count: statusBreakdown?.PROCESSING || 0, icon: '⚙️', color: 'bg-yellow-50' },
    { status: 'READY', count: statusBreakdown?.READY || 0, icon: '✅', color: 'bg-green-50' },
    { status: 'DELIVERED', count: statusBreakdown?.DELIVERED || 0, icon: '🚚', color: 'bg-gray-50' },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <Link to="/orders/new" className="btn-primary">
          ➕ New Order
        </Link>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={totalOrders || 0} icon="📋" color="bg-indigo-50" />
        <StatCard label="Total Revenue" value={`₹${(totalRevenue || 0).toLocaleString()}`} icon="💰" color="bg-emerald-50" />
        <StatCard label="Today's Orders" value={todayOrders || 0} icon="📅" color="bg-orange-50" sub="orders today" />
        <StatCard label="Today's Revenue" value={`₹${(todayRevenue || 0).toLocaleString()}`} icon="📈" color="bg-purple-50" />
      </div>

      {/* Status breakdown */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Orders by Status</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statusCards.map(({ status, count, icon, color }) => (
            <div key={status} className={`card p-4 ${color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span>{icon}</span>
                <StatusBadge status={status} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue chart */}
      {last7Days && last7Days.length > 0 && (
        <div className="card p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Revenue — Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={last7Days} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="_id" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                formatter={(v) => [`₹${v}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {last7Days && last7Days.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-gray-500 text-sm">No data yet. Create your first order to see charts!</p>
          <Link to="/orders/new" className="btn-primary mt-4 inline-flex">Create Order</Link>
        </div>
      )}
    </div>
  );
}
