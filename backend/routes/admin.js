import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const router = Router();

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [users, orders, products, revenue] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    ]);
    res.json({ success: true, data: { totalUsers: users, totalOrders: orders, totalProducts: products, totalRevenue: revenue[0]?.total || 0 } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const { isBlocked, role } = req.body;
    const updates = {};
    if (isBlocked !== undefined) updates.isBlocked = isBlocked;
    if (role) updates.role = role;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: user.toJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/revenue', protect, adminOnly, async (req, res) => {
  try {
    const { start, end } = req.query;
    const match = { paymentStatus: 'paid' };
    if (start || end) {
      match.createdAt = {};
      if (start) match.createdAt.$gte = new Date(start);
      if (end) match.createdAt.$lte = new Date(end);
    }
    const [total, daily, topProducts, orders] = await Promise.all([
      Order.aggregate([{ $match: match }, { $group: { _id: null, revenue: { $sum: '$total' }, profit: { $sum: { $subtract: ['$total', '$discount'] } }, count: { $sum: 1 } } }]),
      Order.aggregate([{ $match: match }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } }, { $sort: { _id: 1 } }, { $limit: 30 }]),
      Order.aggregate([{ $match: match }, { $unwind: '$items' }, { $group: { _id: '$items.name', revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }, qty: { $sum: '$items.quantity' } } }, { $sort: { revenue: -1 } }, { $limit: 10 }]),
      Order.find(match).sort({ createdAt: -1 }).limit(5).populate('userId', 'name email'),
    ]);
    res.json({ success: true, data: { revenue: total[0]?.revenue || 0, profit: total[0]?.profit || 0, orderCount: total[0]?.count || 0, daily, topProducts, recentOrders: orders } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/invoices', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.paymentStatus = status;
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter).populate('userId', 'name email phone').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, data: { orders, page: Number(page), pages: Math.ceil(total / limit), total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
