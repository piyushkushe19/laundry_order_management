import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const GARMENT_TYPES = ['Shirt', 'Pants', 'Saree', 'Blazer', 'Bedsheet', 'Kurta', 'Jacket', 'Dress', 'Towel', 'Other'];

const DEFAULT_PRICES = {
  Shirt: 50, Pants: 60, Saree: 80, Blazer: 120, Bedsheet: 70,
  Kurta: 55, Jacket: 100, Dress: 75, Towel: 30, Other: 50,
};

const emptyGarment = () => ({ type: 'Shirt', quantity: 1, price: DEFAULT_PRICES['Shirt'] });

export default function CreateOrderPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    estimatedDeliveryDate: '',
    notes: '',
  });
  const [garments, setGarments] = useState([emptyGarment()]);

  const updateForm = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const updateGarment = (index, field) => (e) => {
    const updated = [...garments];
    updated[index] = { ...updated[index], [field]: e.target.value };
    // Auto-set price when type changes
    if (field === 'type') {
      updated[index].price = DEFAULT_PRICES[e.target.value] || 50;
    }
    setGarments(updated);
  };

  const addGarment = () => setGarments([...garments, emptyGarment()]);

  const removeGarment = (index) => {
    if (garments.length === 1) return toast.error('At least one garment required');
    setGarments(garments.filter((_, i) => i !== index));
  };

  const totalBill = garments.reduce((sum, g) => sum + (Number(g.quantity) * Number(g.price)), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        garments: garments.map(g => ({
          type: g.type,
          quantity: Number(g.quantity),
          price: Number(g.price),
          subtotal: Number(g.quantity) * Number(g.price),
        })),
      };
      if (!payload.estimatedDeliveryDate) delete payload.estimatedDeliveryDate;
      if (!payload.notes) delete payload.notes;

      const { data } = await api.post('/orders', payload);
      toast.success(`Order ${data.data.orderId} created! 🎉`);
      navigate('/orders');
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed to create order';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details to create a laundry order</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Customer Info */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            👤 Customer Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input
                type="text"
                className="input-field"
                placeholder="Rajesh Kumar"
                value={form.customerName}
                onChange={updateForm('customerName')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                className="input-field"
                placeholder="+91 9876543210"
                value={form.phone}
                onChange={updateForm('phone')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery Date</label>
              <input
                type="date"
                className="input-field"
                value={form.estimatedDeliveryDate}
                onChange={updateForm('estimatedDeliveryDate')}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <input
                type="text"
                className="input-field"
                placeholder="Special instructions..."
                value={form.notes}
                onChange={updateForm('notes')}
              />
            </div>
          </div>
        </div>

        {/* Garments */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">🧥 Garments</h2>
            <button type="button" className="btn-secondary text-sm py-1.5" onClick={addGarment}>
              + Add Item
            </button>
          </div>

          {/* Header */}
          <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-semibold text-gray-400 uppercase px-1">
            <div className="col-span-4">Type</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-3 text-center">Price (₹)</div>
            <div className="col-span-2 text-center">Subtotal</div>
            <div className="col-span-1" />
          </div>

          <div className="space-y-3">
            {garments.map((g, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-12 sm:col-span-4">
                  <select className="input-field" value={g.type} onChange={updateGarment(i, 'type')}>
                    {GARMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    type="number"
                    className="input-field text-center"
                    min="1"
                    value={g.quantity}
                    onChange={updateGarment(i, 'quantity')}
                    required
                  />
                </div>
                <div className="col-span-4 sm:col-span-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                    <input
                      type="number"
                      className="input-field pl-7"
                      min="0"
                      step="0.01"
                      value={g.price}
                      onChange={updateGarment(i, 'price')}
                      required
                    />
                  </div>
                </div>
                <div className="col-span-3 sm:col-span-2 text-center">
                  <span className="font-semibold text-indigo-600 text-sm">
                    ₹{(Number(g.quantity) * Number(g.price)).toLocaleString()}
                  </span>
                </div>
                <div className="col-span-1 text-center">
                  <button
                    type="button"
                    onClick={() => removeGarment(i)}
                    className="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none"
                    disabled={garments.length === 1}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="font-semibold text-gray-700">Total Bill</span>
            <span className="text-xl font-bold text-indigo-600">₹{totalBill.toLocaleString()}</span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="button" className="btn-secondary flex-1 justify-center" onClick={() => navigate('/orders')}>
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Creating...
              </span>
            ) : '🧺 Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
