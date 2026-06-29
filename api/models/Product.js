import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  ingredients: { type: String },
  howToUse: { type: String },
  images: [{ type: String }],
  variants: [{
    label: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
  }],
  tags: [String],
  skinTypes: [{ type: String, enum: ['oily', 'dry', 'combination', 'normal', 'sensitive', 'all'] }],
  rating: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

productSchema.index({ name: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1, 'rating.average': -1 });
productSchema.index({ isFeatured: 1 });

export default mongoose.model('Product', productSchema);
