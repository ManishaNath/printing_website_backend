// D:\GITHUB\printing_website_backend\netlify\functions\api.js
// Ensures Express receives a parsed body inside Netlify Functions.
const serverless = require("serverless-http");
const app = require("../../src/app");
const { connectDB } = require("../../src/config/database");

const handler = serverless(app, {
  basePath: "/.netlify/functions/api",
  request: (req, event /*, context */) => {
    // Debug: see raw CT/length
    if (process.env.DEBUG_REQ === "1") {
      const ct = event?.headers?.["content-type"] || event?.headers?.["Content-Type"];
      console.log("FN request hook:", { ct, hasEventBody: typeof event?.body === "string", len: event?.body?.length || 0 });
    }
    // Hydrate Express body from raw Lambda event if Express saw nothing/empty
    const hasNoBody =
      req.body == null || (typeof req.body === "object" && Object.keys(req.body).length === 0);
    if (hasNoBody && typeof event?.body === "string") {
      try {
        req.body = JSON.parse(event.body);
      } catch {
        req.body = event.body; // keep as string if not JSON
      }
    }
    if (process.env.DEBUG_REQ === "1") {
      console.log("FN hydrated keys:", Object.keys(req.body || {}));
    }
  },
});

exports.handler = async (event, context) => {
  await connectDB().catch((e) => {
    console.error("DB connect error:", e.message);
    throw e;
  });
  return handler(event, context);
};
