import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from '../backend/config/db.js';
import { errorHandler } from '../backend/middleware/utils.js';

import authRoutes from '../backend/routes/auth.js';
import productRoutes from '../backend/routes/products.js';
import orderRoutes from '../backend/routes/orders.js';
import reviewRoutes from '../backend/routes/reviews.js';
import blogRoutes from '../backend/routes/blog.js';
import couponRoutes from '../backend/routes/coupons.js';
import quizRoutes from '../backend/routes/quiz.js';
import cartRoutes from '../backend/routes/cart.js';
import wishlistRoutes from '../backend/routes/wishlist.js';
import adminRoutes from '../backend/routes/admin.js';
import uploadRoutes from '../backend/routes/upload.js';

const app = express();

app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
  process.env.VITE_API_URL,
].filter(Boolean);

const corsOrigin = (origin, callback) => {
  if (!origin) return callback(null, true);
  if (allowedOrigins.includes(origin)) return callback(null, true);
  if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return callback(null, true);
  return callback(null, true);
};

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use(errorHandler);

connectDB();

if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 9191;
  app.listen(PORT, () => console.log(`Opal server on port ${PORT}`));
}

export default app;
