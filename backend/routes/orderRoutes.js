const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes protected
router.use(protect);

router.post(
  '/',
  [
    body('customerName').trim().notEmpty().withMessage('Customer name is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('garments').isArray({ min: 1 }).withMessage('At least one garment is required'),
    body('garments.*.type').notEmpty().withMessage('Garment type is required'),
    body('garments.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('garments.*.price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  ],
  createOrder
);

router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

module.exports = router;
