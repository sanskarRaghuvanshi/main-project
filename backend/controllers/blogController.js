import Blog from '../models/Blog.js';

export const getAll = async (req, res) => {
  try {
    const { tag, search, page = 1, limit = 9 } = req.query;
    const filter = { isPublished: true };
    if (tag) filter.tags = tag;
    if (search) filter.title = { $regex: search, $options: 'i' };
    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter).sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).populate('relatedProducts', 'name price images');
    res.json({ success: true, data: { blogs, page: Number(page), pages: Math.ceil(total / limit), total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate('relatedProducts', 'name price images brand');
    if (!blog) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTags = async (req, res) => {
  try {
    const tags = await Blog.distinct('tags');
    res.json({ success: true, data: tags });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const adminGetAll = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ publishedAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
