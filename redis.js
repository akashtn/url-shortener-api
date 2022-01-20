const Redis = require("redis");
const redisClient = Redis.createClient({
  socket: {
    host: "redis-server",
    port: 6379,
  },
});

module.exports = redisClient;
