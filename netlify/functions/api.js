// /netlify/functions/api.js
const serverless = require("serverless-http");
const app = require("../../src/app");
const { connectDB } = require("../../src/config/database");

// Ensure Express gets a parsed body even when the platform hands us a string
const handler = serverless(app, {
  basePath: "/.netlify/functions/api",
  request: (req, event /*, context */) => {
    // If Express has nothing (or {}), but the raw event has a body, hydrate it
    if (
      (req.body == null ||
        (typeof req.body === "object" && Object.keys(req.body).length === 0)) &&
      event &&
      typeof event.body === "string"
    ) {
      try {
        req.body = JSON.parse(event.body);
      } catch {
        req.body = event.body; // not JSON; keep as string
      }
    }
  },
});

exports.handler = async (event, context) => {
  await connectDB(); // make sure Mongo is ready on cold starts
  return handler(event, context);
};
