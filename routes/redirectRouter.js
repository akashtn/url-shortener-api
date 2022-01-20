const express = require("express");
const router = express.Router();
const indexCoredirectControllerntroller = require("../controllers/redirectController");

router.route("/:code").get(redirectController);

module.exports = router;
