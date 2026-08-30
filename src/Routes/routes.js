// routes/index.js
const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const profileRoutes = require("./profile.routes");
const postRoutes = require("./post.routes");
const connectionRoutes = require("./connection.routes")
const educationRoutes = require("./education.routes")

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/posts", postRoutes);
router.use("/connections", connectionRoutes)
router.use("/education",educationRoutes)
module.exports = router;
