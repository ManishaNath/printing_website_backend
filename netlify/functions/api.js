// /netlify/functions/api.js
const serverless = require("serverless-http");
const app = require("../../src/app");
const { connectDB } = require("../../src/config/database");

// Wrap Express and ensure DB is connected before handling the request
const handler = serverless(app, { basePath: "/.netlify/functions/api" });

exports.handler = async (event, context) => {
  await connectDB();           // <-- ensures Mongo is ready
  return handler(event, context);
};
