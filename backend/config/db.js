import mongoose from 'mongoose';
mongoose.set('bufferCommands', false);

let cached = global._mongooseConn;
if (!cached) cached = global._mongooseConn = { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;
  if (cached.promise) return cached.promise;

  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  cached.promise = mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 }).then(m => {
    console.log(`MongoDB Connected: ${m.connection.host}`);
    return m;
  }).catch(err => {
    console.error(`DB Error: ${err.message}`);
    cached.promise = null;
    throw err;
  });

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
