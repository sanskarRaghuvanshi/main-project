import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import Coupon from '../backend/models/Coupon.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', 'api', '.env') });

const coupons = [
  { code: 'WELCOME20', discountType: 'percent', discountValue: 20, minOrderValue: 499, maxDiscount: 200, expiresAt: '2027-12-31', usageLimit: 1000, usedCount: 0 },
  { code: 'OPAL500', discountType: 'flat', discountValue: 500, minOrderValue: 2499, expiresAt: '2027-12-31', usageLimit: 200 },
  { code: 'FRESHLY10', discountType: 'percent', discountValue: 10, minOrderValue: 0, maxDiscount: 150, expiresAt: '2026-12-31', usageLimit: 500 },
  { code: 'BEAUTY100', discountType: 'flat', discountValue: 100, minOrderValue: 599, expiresAt: '2026-12-31', usageLimit: 300 },
  { code: 'GLOW25', discountType: 'percent', discountValue: 25, minOrderValue: 1499, maxDiscount: 350, expiresAt: '2026-09-30', usageLimit: 150 },
  { code: 'SUMMER15', discountType: 'percent', discountValue: 15, minOrderValue: 799, maxDiscount: 200, expiresAt: '2026-08-31', usageLimit: 200 },
  { code: 'FIRSTORDER', discountType: 'flat', discountValue: 200, minOrderValue: 999, expiresAt: '2026-12-31', usageLimit: 500 },
  { code: 'MEGA50', discountType: 'percent', discountValue: 50, minOrderValue: 3999, maxDiscount: 1000, expiresAt: '2026-06-30', usageLimit: 50 },
  { code: 'FLAT250', discountType: 'flat', discountValue: 250, minOrderValue: 1499, expiresAt: '2026-12-31', usageLimit: 250 },
  { code: 'VIP30', discountType: 'percent', discountValue: 30, minOrderValue: 2999, maxDiscount: 600, expiresAt: '2026-12-31', usageLimit: 100 },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  await Coupon.deleteMany({});
  await Coupon.insertMany(coupons);
  console.log(`${coupons.length} coupons seeded successfully`);
  await mongoose.disconnect();
};

seed().catch(e => { console.error(e); process.exit(1); });
