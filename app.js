const express = require("express");
const redisClient = require("./redis");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json({ extended: false }));

// Routes
app.use("/api/v1/url", () => {}); // Shorten URL
app.use("/", () => {}); // Redirect to the original URL

const PORT = process.env.PORT || 3000;

(async () => {
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  await redisClient.connect();
  app.listen(PORT, console.log(`Server listening on port ${PORT}`));
})();

module.exports = app;
