// /src/config/database.js
const mongoose = require("mongoose");

// Reuse connection across function invocations
let cached = global._mongoCached;
if (!cached) {
  cached = global._mongoCached = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGO_URL;
  if (!uri) throw new Error("MONGO_URL is required");

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    // bufferCommands: false -> don't buffer if not connected
    cached.promise = mongoose.connect(uri, { bufferCommands: false }).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { connectDB };
