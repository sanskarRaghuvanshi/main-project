import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId', 'name images brand variants');
    if (!cart) cart = { userId: req.user._id, items: [] };
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addItem = async (req, res) => {
  try {
    const { productId, quantity = 1, variant } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const v = variant ? product.variants.find(vt => vt.label === variant) : product.variants[0];
    const price = v?.price || 0;

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) cart = await Cart.create({ userId: req.user._id, items: [] });
    const existing = cart.items.find(i => i.productId.toString() === productId && i.variant === (variant || product.variants[0]?.label));
    if (existing) existing.quantity += quantity;
    else cart.items.push({ productId, quantity, variant: variant || product.variants[0]?.label, price });
    await cart.save();
    await cart.populate('items.productId', 'name images brand variants');
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.productId', 'name price images brand variants');
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const removeItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    cart.items = cart.items.filter(i => i._id.toString() !== req.params.id);
    await cart.save();
    await cart.populate('items.productId', 'name images brand variants');
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ userId: req.user._id }, { $set: { items: [] } });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
