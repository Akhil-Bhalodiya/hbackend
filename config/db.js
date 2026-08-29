const mongoose = require('mongoose');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('[MongoDB Error] MONGO_URI environment variable is missing!');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = mongoose
      .connect(mongoUri || 'mongodb://127.0.0.1:27017/hibiscus_db', opts)
      .then((mongooseInstance) => {
        console.log(`[MongoDB] Connected: ${mongooseInstance.connection.host} / ${mongooseInstance.connection.name}`);
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        console.error(`[MongoDB Error] Connection failed: ${err.message}`);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;
