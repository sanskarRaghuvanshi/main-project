import Wishlist from '../models/Wishlist.js';

export const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user._id }).populate('productId').sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const existing = await Wishlist.findOne({ userId: req.user._id, productId });
    if (existing) return res.status(400).json({ success: false, message: 'Already in wishlist' });
    const item = await Wishlist.create({ userId: req.user._id, productId });
    await item.populate('productId');
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const removeItem = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ userId: req.user._id, productId: req.params.productId });
    res.json({ success: true, message: 'Removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
