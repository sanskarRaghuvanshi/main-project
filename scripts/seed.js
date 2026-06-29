import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import User from '../api/models/User.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', 'api', '.env') });

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  const existing = await User.findOne({ email: 'admin@opal.com' });
  if (existing) {
    console.log('Admin already exists');
    await mongoose.disconnect();
    return;
  }
  await User.create({ name: 'Admin', email: 'admin@opal.com', passwordHash: 'admin123', role: 'admin', isVerified: true });
  console.log('Admin created: admin@opal.com / admin123');
  await mongoose.disconnect();
};

seed().catch(e => { console.error(e); process.exit(1); });
