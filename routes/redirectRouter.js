const express = require("express");
const router = express.Router();
const redirectController = require("../controllers/redirectController");

router.route("/:code").get(redirectController);

module.exports = router;
