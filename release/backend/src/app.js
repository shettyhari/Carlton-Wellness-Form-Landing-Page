const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const leadsRouter = require("./routes/leads");

const app = express();

// Behind Nginx / a hosting proxy, use the visitor's real IP for rate limiting
app.set("trust proxy", process.env.TRUST_PROXY === "false" ? false : 1);
app.disable("x-powered-by");

// CORS is only needed when the frontend is hosted on a different domain from the API.
// List allowed origins in CORS_ORIGINS, comma-separated.
const origins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
if (origins.length) {
  app.use("/api", cors({ origin: origins, methods: ["POST", "GET"] }));
}

app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/leads", leadsRouter);

app.use("/api", (req, res) => res.status(404).json({ ok: false, error: "Not found" }));

// Optionally serve the landing page from the same server (default: on)
const frontendDir = path.resolve(__dirname, "..", process.env.FRONTEND_DIR || "../frontend");
if (process.env.SERVE_FRONTEND !== "false" && fs.existsSync(frontendDir)) {
  // When served from here, the page posts leads to this server's /api/leads
  app.get("/config.js", (req, res) => {
    const config = {
      formEndpoint: "/api/leads",
      metaPixelId: process.env.META_PIXEL_ID || ""
    };
    res.type("application/javascript").set("Cache-Control", "no-cache");
    res.send(`window.CARLTON_CONFIG = ${JSON.stringify(config)};\n`);
  });
  app.use(express.static(frontendDir, { extensions: ["html"] }));
}

// Malformed JSON and other errors
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed" || err.type === "entity.too.large") {
    return res.status(400).json({ ok: false, error: "Invalid request." });
  }
  console.error(err);
  res.status(500).json({ ok: false, error: "Something went wrong." });
});

module.exports = app;
