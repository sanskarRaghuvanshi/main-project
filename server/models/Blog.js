import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  coverImage: String,
  content: { type: String, required: true },
  excerpt: String,
  tags: [String],
  author: {
    name: { type: String, default: 'Opal Team' },
    avatar: String,
  },
  relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isPublished: { type: Boolean, default: true },
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
