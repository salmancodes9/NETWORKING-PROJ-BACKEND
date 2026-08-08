// routes/index.js
const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const profileRoutes = require("./profile.routes");
const postRoutes = require("./post.routes");

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/posts", postRoutes);

module.exports = router;
