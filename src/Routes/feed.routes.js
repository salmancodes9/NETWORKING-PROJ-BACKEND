const express = require("express");
const router = express.Router();

const { getFeed } = require("../Controllers/feed.controller");
const authenticate = require("../Middleware/protectClinet");

router.get("/", authenticate, getFeed);

module.exports = router;