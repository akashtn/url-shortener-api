const redisClient = require("../redis");

module.exports = async (req, res) => {
  try {
    const longUrl = await redisClient.get(req.params.code);
    // console.log(longUrl);
    if (longUrl) {
      res.redirect(longUrl);
    } else {
      res.status(404).json({ msg: "No URL found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
