require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const app = require("./app");

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`Carlton Wellness backend running on http://localhost:${PORT}`);
});
