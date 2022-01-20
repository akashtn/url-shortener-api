const express = require("express");
const router = express.Router();
const urlShortenerController = require("../controllers/urlShortenerController");

router.route("/shorten").post(urlShortenerController);

module.exports = router;
