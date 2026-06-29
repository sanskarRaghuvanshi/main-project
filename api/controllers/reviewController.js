import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const create = async (req, res) => {
  try {
    const { productId, rating, title, body, photos } = req.body;
    const existing = await Review.findOne({ userId: req.user._id, productId });
    if (existing) return res.status(400).json({ success: false, message: 'Already reviewed' });
    const review = await Review.create({ userId: req.user._id, productId, rating, title, body, photos: photos || [] });
    const stats = await Review.aggregate([{ $match: { productId: review.productId } }, { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }]);
    if (stats.length) await Product.findByIdAndUpdate(productId, { 'rating.average': Math.round(stats[0].avg * 10) / 10, 'rating.count': stats[0].count });
    await review.populate('userId', 'name avatar');
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getByProduct = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await Review.countDocuments({ productId: req.params.id });
    const reviews = await Review.find({ productId: req.params.id }).populate('userId', 'name avatar').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, data: { reviews, page: Number(page), pages: Math.ceil(total / limit), total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMy = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id }).populate('productId', 'name images').sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review || review.userId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Unauthorized' });
    Object.assign(review, req.body);
    await review.save();
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Not found' });
    if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Unauthorized' });
    const { productId } = review;
    await review.deleteOne();
    const stats = await Review.aggregate([{ $match: { productId } }, { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }]);
    if (stats.length) await Product.findByIdAndUpdate(productId, { 'rating.average': Math.round(stats[0].avg * 10) / 10, 'rating.count': stats[0].count });
    else await Product.findByIdAndUpdate(productId, { 'rating.average': 0, 'rating.count': 0 });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
