const express = require("express");
const cors = require("cors");
const enquiriesRoute = require("./routes/enquiries");

const app = express();

// Always parse JSON regardless of +json suffix or lowercase variations
app.use((req, res, next) => {
  let rawType = (req.headers["content-type"] || "").toLowerCase();

  // parse JSON types
  if (rawType.includes("application/json") || rawType.includes("+json")) {
    let data = "";
    req.on("data", chunk => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        req.body = data ? JSON.parse(data) : {};
      } catch (err) {
        console.error("JSON parse error:", err.message);
        req.body = {};
      }
      next();
    });
  } else {
    next();
  }
});

function buildCorsCheck() {
  const raw = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const allowAny = raw.includes("*");
  const entries = raw.filter((v) => v !== "*");

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

app.use(
  cors({
    origin: buildCorsCheck(),
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Debug route to see parsed body
app.post("/debug/body", (req, res) => {
  res.json({ parsedBody: req.body, type: typeof req.body });
});

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/enquiries", enquiriesRoute);

module.exports = app;
