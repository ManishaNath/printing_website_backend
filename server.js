// /backend/server.js
require("dotenv").config();
const app = require("./src/app");
const { connectDB } = require("./src/config/database");

(async () => {
  await connectDB();
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`API listening on :${port}`));
})();
