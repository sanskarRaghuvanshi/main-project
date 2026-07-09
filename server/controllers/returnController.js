import Return from '../models/Return.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendReturnConfirmation } from '../utils/email.js';
import Razorpay from 'razorpay';

let _razorpay = null;
const getRazorpay = () => {
  if (!_razorpay) _razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  return _razorpay;
};

export const createReturn = async (req, res) => {
  try {
    const { orderId, items, reason, reasonDetail, photos } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.userId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Unauthorized' });
    if (order.orderStatus !== 'delivered') return res.status(400).json({ success: false, message: 'Only delivered orders can be returned' });
    const existing = await Return.findOne({ orderId, userId: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'Return already requested for this order' });
    const returnItems = items.map(i => ({
      productId: i.productId, name: i.name, image: i.image || '', variant: i.variant || '',
      price: i.price, quantity: i.quantity,
    }));
    const refundAmount = returnItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const returnReq = await Return.create({
      orderId, userId: req.user._id, items: returnItems,
      reason, reasonDetail, photos: photos || [],
      refundAmount,
      statusHistory: [{ status: 'pending', note: 'Return requested' }],
    });
    sendReturnConfirmation(req.user.email, returnReq).catch(() => {});
    res.status(201).json({ success: true, data: returnReq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyReturns = async (req, res) => {
  try {
    const returns = await Return.find({ userId: req.user._id }).populate('orderId', 'orderNumber').sort({ createdAt: -1 });
    res.json({ success: true, data: returns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getReturnById = async (req, res) => {
  try {
    const returnReq = await Return.findById(req.params.id).populate('orderId', 'orderNumber');
    if (!returnReq) return res.status(404).json({ success: false, message: 'Not found' });
    if (returnReq.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    res.json({ success: true, data: returnReq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllReturns = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const total = await Return.countDocuments(filter);
    const returns = await Return.find(filter).populate('userId', 'name email').populate('orderId', 'orderNumber').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, data: { returns, page: Number(page), pages: Math.ceil(total / limit), total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const approveReturn = async (req, res) => {
  try {
    const returnReq = await Return.findById(req.params.id);
    if (!returnReq) return res.status(404).json({ success: false, message: 'Not found' });
    if (returnReq.status !== 'pending') return res.status(400).json({ success: false, message: 'Return already processed' });
    returnReq.status = 'approved';
    returnReq.adminNote = req.body.note || '';
    returnReq.statusHistory.push({ status: 'approved', note: req.body.note || 'Return approved' });
    const order = await Order.findById(returnReq.orderId);
    if (order && order.paymentStatus === 'paid' && order.paymentId) {
      try {
        const rzpOrder = await getRazorpay().payments.fetch(order.paymentId);
        const refund = await getRazorpay().payments.refund(order.paymentId, { amount: Math.round(returnReq.refundAmount * 100) });
        returnReq.refundId = refund.id;
        returnReq.status = 'refunded';
        returnReq.statusHistory.push({ status: 'refunded', note: 'Refund initiated via Razorpay' });
        order.paymentStatus = 'refunded';
        await order.save();
      } catch (rzpErr) {
        console.error('Refund failed:', rzpErr.message);
        returnReq.status = 'approved';
      }
    }
    await returnReq.save();
    res.json({ success: true, data: returnReq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const rejectReturn = async (req, res) => {
  try {
    const returnReq = await Return.findById(req.params.id);
    if (!returnReq) return res.status(404).json({ success: false, message: 'Not found' });
    if (returnReq.status !== 'pending') return res.status(400).json({ success: false, message: 'Return already processed' });
    const note = req.body.note || 'Return rejected';
    returnReq.status = 'rejected';
    returnReq.adminNote = note;
    returnReq.statusHistory.push({ status: 'rejected', note });
    await returnReq.save();
    res.json({ success: true, data: returnReq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
