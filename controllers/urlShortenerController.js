const validUrl = require("valid-url");
const redisClient = require("../redis");

module.exports = async (req, res) => {
  const { longUrl } = req.body;
  const baseUrl = process.env.baseUrl;

  // Check base URL
  if (!validUrl.isUri(baseUrl)) {
    return res.status(400).json({ msg: "Invalid base URL" });
  }

  // Check long URL
  if (validUrl.isUri(longUrl)) {
    try {
      let shortUrl = await redisClient.get(longUrl);
      // console.log(shortUrl);
      if (shortUrl) {
        res.status(200).json({
          longUrl,
          shortUrl,
        });
      } else {
        // Create a short URL code
        const urlCode =
          new Date().getTime().toString(26).slice(6) +
          Math.random().toString(26).slice(9);
        // Construct the short URL
        shortUrl = baseUrl + "/" + urlCode;
        // Long URL -> Short URL mapping for storing
        await redisClient.set(longUrl, shortUrl);
        // URL code -> Long URL mapping for retrieval
        await redisClient.set(urlCode, longUrl);

        res.status(201).json({
          longUrl,
          shortUrl,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  } else {
    // console.log(longUrl)
    res.status(400).json({ msg: "Invalid long URL" });
  }
};
