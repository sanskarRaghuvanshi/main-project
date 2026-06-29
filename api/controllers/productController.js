import Product from '../models/Product.js';

export const getAll = async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, skinType, sort, page = 1, limit = 12, search } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (skinType) filter.skinTypes = skinType;
    if (minPrice || maxPrice) filter['variants.price'] = {};
    if (minPrice) filter['variants.price'].$gte = Number(minPrice);
    if (maxPrice) filter['variants.price'].$lte = Number(maxPrice);
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { brand: { $regex: search, $options: 'i' } }, { tags: { $regex: search, $options: 'i' } }];

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { 'variants.price': 1 };
    if (sort === 'price_desc') sortObj = { 'variants.price': -1 };
    if (sort === 'rating') sortObj = { 'rating.average': -1 };
    if (sort === 'newest') sortObj = { createdAt: -1 };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(sortObj).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, data: { products, page: Number(page), pages: Math.ceil(total / limit), total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getFeatured = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true }).limit(8);
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
