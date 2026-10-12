// Builds ready-to-upload copies into release/:
//   release/frontend  -> the static site (upload to public_html or the web root)
//   release/backend   -> the API (run `npm ci --omit=dev` on the server)
// Usage: npm run build   (from the repo root)

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const release = path.join(root, "release");

const SKIP = new Set(["node_modules", ".env", "test"]);

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

fs.rmSync(path.join(release, "frontend"), { recursive: true, force: true });
fs.rmSync(path.join(release, "backend"), { recursive: true, force: true });

copyDir(path.join(root, "frontend"), path.join(release, "frontend"));
copyDir(path.join(root, "backend"), path.join(release, "backend"));
fs.copyFileSync(path.join(__dirname, "ecosystem.config.js"), path.join(release, "backend", "ecosystem.config.js"));

console.log("Release built:");
console.log("  release/frontend");
console.log("  release/backend");
