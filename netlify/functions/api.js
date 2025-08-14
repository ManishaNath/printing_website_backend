// /netlify/functions/api.js
const serverless = require("serverless-http");
const app = require("../../src/app");
const { connectDB } = require("../../src/config/database");

// Inject parsed event.body into req.body if Express didn't parse it
const handler = serverless(app, {
  basePath: "/.netlify/functions/api",
  request: (req, event /*, context */) => {
    if (
      (req.body == null ||
        (typeof req.body === "object" && Object.keys(req.body).length === 0)) &&
      event &&
      typeof event.body === "string"
    ) {
      try {
        req.body = JSON.parse(event.body);
      } catch {
        req.body = event.body; // not JSON; leave as string
      }
    }
  },
});

exports.handler = async (event, context) => {
  await connectDB(); // ensure Mongo is ready for each cold start
  return handler(event, context);
};
