import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUSES = ['ALL', 'RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];
const GARMENT_TYPES = ['', 'Shirt', 'Pants', 'Saree', 'Blazer', 'Bedsheet', 'Kurta', 'Jacket', 'Dress', 'Towel', 'Other'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [garmentType, setGarmentType] = useState('');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append('search', search);
      if (status !== 'ALL') params.append('status', status);
      if (garmentType) params.append('garmentType', garmentType);
      const { data } = await api.get(`/orders?${params}`);
      setOrders(data.data);
      setPagination(data.pagination);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [search, status, garmentType, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await api.delete(`/orders/${orderId}`);
      toast.success('Order deleted');
      fetchOrders();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm">{pagination.total || 0} total orders</p>
        </div>
        <Link to="/orders/new" className="btn-primary">➕ New Order</Link>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="input-field flex-1 min-w-48"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select className="input-field w-auto" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            {STATUSES.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Status' : s}</option>)}
          </select>
          <select className="input-field w-auto" value={garmentType} onChange={(e) => { setGarmentType(e.target.value); setPage(1); }}>
            <option value="">All Garments</option>
            {GARMENT_TYPES.filter(Boolean).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Orders list */}
      {loading ? (
        <LoadingSpinner text="Loading orders..." />
      ) : orders.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-4xl mb-3">🧺</p>
          <p className="text-gray-500 font-medium">No orders found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting filters or create a new order</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="card p-4 hover:border-indigo-200 transition-colors">
              <div className="flex items-start gap-4 flex-wrap">
                {/* Order info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {order.orderId}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mt-1">{order.customerName}</h3>
                  <p className="text-sm text-gray-500">📞 {order.phone}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 flex-wrap">
                    <span>🧥 {order.garments.length} garment type(s)</span>
                    <span>💰 ₹{order.totalAmount.toLocaleString()}</span>
                    <span>📅 {new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                    {order.estimatedDeliveryDate && (
                      <span>🚚 ETA: {new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN')}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    className="input-field w-auto text-xs py-1.5"
                    value={order.status}
                    disabled={updatingId === order._id}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  >
                    {['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    className="btn-secondary text-xs py-1.5 px-3"
                    onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                  >
                    {expandedId === order._id ? 'Hide' : 'Details'}
                  </button>
                  <button
                    className="text-red-400 hover:text-red-600 transition-colors p-1.5"
                    onClick={() => handleDelete(order._id)}
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>

              {/* Expanded garments */}
              {expandedId === order._id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Garment Details</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-400 uppercase">
                          <th className="text-left pb-2">Type</th>
                          <th className="text-right pb-2">Qty</th>
                          <th className="text-right pb-2">Price</th>
                          <th className="text-right pb-2">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.garments.map((g, i) => (
                          <tr key={i} className="border-t border-gray-50">
                            <td className="py-2 font-medium">{g.type}</td>
                            <td className="py-2 text-right">{g.quantity}</td>
                            <td className="py-2 text-right">₹{g.price}</td>
                            <td className="py-2 text-right font-semibold">₹{g.subtotal}</td>
                          </tr>
                        ))}
                        <tr className="border-t-2 border-gray-200">
                          <td colSpan="3" className="py-2 font-bold text-right pr-4">Total</td>
                          <td className="py-2 font-bold text-indigo-600">₹{order.totalAmount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {order.notes && (
                    <p className="text-sm text-gray-500 mt-3 bg-gray-50 rounded-lg p-3">
                      📝 {order.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            className="btn-secondary py-2 px-3 text-sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-600 px-3">
            Page {page} of {pagination.pages}
          </span>
          <button
            className="btn-secondary py-2 px-3 text-sm"
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
