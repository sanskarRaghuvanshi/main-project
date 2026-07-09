import mongoose from 'mongoose';

const returnSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    variant: String,
    price: Number,
    quantity: { type: Number, min: 1 },
  }],
  reason: {
    type: String,
    enum: ['damaged', 'wrong_item', 'defective', 'not_as_described', 'other'],
    required: true,
  },
  reasonDetail: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'refunded'],
    default: 'pending',
  },
  photos: [{ type: String }],
  refundAmount: { type: Number },
  refundId: { type: String },
  adminNote: { type: String },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
  }],
}, { timestamps: true });

returnSchema.index({ userId: 1, createdAt: -1 });
returnSchema.index({ orderId: 1 });

export default mongoose.model('Return', returnSchema);
