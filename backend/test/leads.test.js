const { test, before, after } = require("node:test");
const assert = require("node:assert");

process.env.SERVE_FRONTEND = "true";
const leadStore = require("../src/leadStore");
const saved = [];
leadStore.saveLead = async (lead) => { saved.push(lead); };
const app = require("../src/app");

let server;
let base;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

function post(body) {
  return fetch(`${base}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

test("saves a valid lead", async () => {
  const res = await post({
    name: "Test User",
    phone: "+91 98765 43210",
    email: "Test@Example.com",
    city: "Pune, Maharashtra",
    capital_contribution: "₹75 L – ₹1 Cr",
    timeline: "Within 3 months",
    background: "Business owner"
  });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(saved.at(-1).email, "test@example.com");
  assert.strictEqual(saved.at(-1).capital_contribution, "₹75 L – ₹1 Cr");
});

test("rejects a lead with a bad phone and email", async () => {
  const before = saved.length;
  const res = await post({ name: "Test User", phone: "123", email: "nope" });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(saved.length, before);
});

test("silently drops honeypot submissions", async () => {
  const before = saved.length;
  const res = await post({ name: "Bot", phone: "+91 98765 43210", email: "bot@example.com", company_website: "x" });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(saved.length, before);
});

test("serves the page config pointing at this server", async () => {
  const res = await fetch(`${base}/config.js`);
  const text = await res.text();
  assert.match(text, /"formEndpoint":"\/api\/leads"/);
});

test("serves the landing page", async () => {
  const res = await fetch(`${base}/`);
  assert.strictEqual(res.status, 200);
  assert.match(await res.text(), /Carlton Wellness/);
});
