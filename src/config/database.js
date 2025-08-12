// /backend/src/config/database.js
const mongoose = require("mongoose");

async function connectDB() {
  const url = process.env.MONGO_URL;
  if (!url) throw new Error("MONGO_URL is required");
  await mongoose.connect(url, { autoIndex: true });
  console.log("MongoDB connected");
}

module.exports = { connectDB };
