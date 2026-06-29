import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import { sendOrderConfirmation } from '../utils/email.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

let _razorpay = null;
const getRazorpay = () => {
  if (!_razorpay) _razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  return _razorpay;
};

export const createOrder = async (req, res) => {
  try {
    const { items, address, paymentMethod, couponCode, subtotal, deliveryFee, discount, total } = req.body;
    const orderItems = items.map(i => ({
      productId: i.productId, name: i.name, image: i.image || '', variant: i.variant || '',
      price: i.price, quantity: i.quantity,
    }));
    const order = await Order.create({
      userId: req.user._id, items: orderItems, address, paymentMethod,
      couponUsed: couponCode ? { code: couponCode, discount: discount || 0 } : {},
      subtotal, deliveryFee: deliveryFee || 0, discount: discount || 0, total,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      statusHistory: [{ status: 'pending', note: 'Order placed' }],
    });

    if (paymentMethod === 'razorpay') {
      const rzp = await getRazorpay().orders.create({ amount: Math.round(total * 100), currency: 'INR', receipt: order._id.toString() });
      order.paymentId = rzp.id;
      await order.save();
      return res.json({ success: true, data: { order, razorpayOrderId: rzp.id, amount: Math.round(total * 100) } });
    }
    await Cart.findOneAndUpdate({ userId: req.user._id }, { $set: { items: [] } });
    for (const item of orderItems) {
      await Product.updateOne({ _id: item.productId, 'variants.label': item.variant }, { $inc: { 'variants.$.stock': -item.quantity } });
    }
    sendOrderConfirmation(req.user.email, order).catch(() => {});
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign).digest('hex');
    if (expected !== razorpay_signature) return res.status(400).json({ success: false, message: 'Invalid signature' });
    const order = await Order.findOne({ paymentId: razorpay_order_id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.statusHistory.push({ status: 'confirmed', note: 'Payment confirmed' });
    await order.save();
    await Cart.findOneAndUpdate({ userId: order.userId }, { $set: { items: [] } });
    for (const item of order.items) {
      await Product.updateOne({ _id: item.productId, 'variants.label': item.variant }, { $inc: { 'variants.$.stock': -item.quantity } });
    }
    sendOrderConfirmation(req.user?.email || '', order).catch(() => {});
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Not found' });
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Not found' });
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    if (!['pending', 'confirmed'].includes(order.orderStatus)) return res.status(400).json({ success: false, message: 'Cannot cancel now' });
    order.orderStatus = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', note: 'Cancelled by user' });
    await order.save();
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderStatus, note } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, {
      orderStatus, $push: { statusHistory: { status: orderStatus, note } }
    }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter).populate('userId', 'name email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, data: { orders, page: Number(page), pages: Math.ceil(total / limit), total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
