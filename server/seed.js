import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
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
