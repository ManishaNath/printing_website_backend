// D:\GITHUB\printing_website_backend\src\app.js
// Keep this version (robust JSON + request logging + CORS allowlist)
const express = require("express");
const cors = require("cors");
const enquiriesRoute = require("./routes/enquiries");

const app = express();

// robust JSON parsing (incl. application/*+json)
app.use(express.json({ limit: "1mb", type: ["application/json", "application/*+json"] }));

// normalize when body arrives as string/empty
app.use((req, _res, next) => {
  const ct = req.headers["content-type"] || "";
  const isJson = ct.includes("application/json") || (ct.includes("application/") && ct.includes("+json"));
  if (isJson) {
    if (typeof req.body === "string") {
      try { req.body = JSON.parse(req.body || "{}"); } catch {}
    } else if (req.body == null) {
      req.body = {};
    }
  }
  if (process.env.DEBUG_REQ === "1") {
    console.log("REQ", { method: req.method, url: req.url, keys: Object.keys(req.body || {}), ct });
  }
  next();
});

function buildCorsCheck() {
  const raw = (process.env.CORS_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean);
  const allowAny = raw.includes("*");
  const entries = raw.filter(v => v !== "*");
  function isAllowed(origin) {
    if (!origin) return true;
    if (allowAny) return true;
    try {
      const u = new URL(origin);
      for (const e of entries) {
        if (!e) continue;
        if (e === origin) return true;
        if (/^https?:\/\//i.test(e)) {
          const eu = new URL(e);
          if (eu.hostname === u.hostname && eu.protocol === u.protocol) return true;
          continue;
        }
        if (e.startsWith(".")) {
          if (u.hostname.endsWith(e.slice(1))) return true;
          continue;
        }
        if (u.hostname === e) return true;
      }
    } catch {}
    return false;
  }
  return (origin, cb) => {
    const ok = isAllowed(origin);
    if (process.env.DEBUG_CORS === "1") console.log("CORS", { origin, ok, entries });
    return ok ? cb(null, true) : cb(new Error("Not allowed by CORS"));
  };
}

app.use(cors({
  origin: buildCorsCheck(),
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/enquiries", enquiriesRoute);

module.exports = app;
