const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const garmentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Shirt', 'Pants', 'Saree', 'Blazer', 'Bedsheet', 'Kurta', 'Jacket', 'Dress', 'Towel', 'Other'],
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      default: () => 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    garments: {
      type: [garmentSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: 'At least one garment is required',
      },
    },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'],
      default: 'RECEIVED',
    },
    estimatedDeliveryDate: { type: Date },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

// Index for search
orderSchema.index({ customerName: 'text', phone: 'text' });

module.exports = mongoose.model('Order', orderSchema);
