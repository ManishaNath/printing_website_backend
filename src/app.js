// /backend/src/app.js
const express = require("express");
const cors = require("cors");
const enquiriesRoute = require("./routes/enquiries");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: (origin, cb) => {
      const allowed = (process.env.CORS_ORIGIN || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (!origin || allowed.length === 0 || allowed.includes(origin))
        return cb(null, true);
      // why: prevent unexpected origins in production
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: false,
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/enquiries", enquiriesRoute);

module.exports = app;
