// /src/app.js
const express = require("express");
const cors = require("cors");
const enquiriesRoute = require("./routes/enquiries");

const app = express();
app.use(express.json());

// --- Robust CORS allowlist from CORS_ORIGIN (comma-separated) ---
function buildCorsCheck() {
  const raw = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const allowAny = raw.includes("*");
  const entries = raw.filter((v) => v !== "*");

  function isAllowed(origin) {
    if (!origin) return true; // curl/Postman
    if (allowAny) return true;
    try {
      const u = new URL(origin);
      for (const e of entries) {
        if (!e) continue;
        if (e === origin) return true;                 // exact
        if (/^https?:\/\//i.test(e)) {                 // scheme+host
          const eu = new URL(e);
          if (eu.hostname === u.hostname && eu.protocol === u.protocol) return true;
          continue;
        }
        if (e.startsWith(".")) {                       // wildcard domain: .netlify.app
          if (u.hostname.endsWith(e.slice(1))) return true;
          continue;
        }
        if (u.hostname === e) return true;             // bare hostname
      }
    } catch (_) {}
    return false;
  }

  return (origin, cb) => {
    const ok = isAllowed(origin);
    if (process.env.DEBUG_CORS === "1") console.log("CORS", { origin, ok, entries });
    return ok ? cb(null, true) : cb(new Error("Not allowed by CORS"));
  };
}
// Debug (place BEFORE app.use(cors(...)))
app.get("/debug/cors", (req, res) => {
  res.json({
    origin: req.headers.origin || null,
    host: req.headers.host,
    url: req.url,
  });
});

app.use(
  cors({
    origin: buildCorsCheck(),
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Health + routes (no '*' patterns – safe for Express v5)
app.get("/health", (_req, res) => res.json({ ok: true }));

// NOTE: mount at /enquiries (simpler function path)
// Production URL: /.netlify/functions/api/enquiries
app.use("/enquiries", enquiriesRoute);

module.exports = app;

