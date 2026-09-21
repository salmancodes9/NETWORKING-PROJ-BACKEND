// routes/index.js
const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const profileRoutes = require("./profile.routes");
const postRoutes = require("./post.routes");
const companyPostRoutes = require("./companyPost.routes");
const connectionRoutes = require("./connection.routes")
const educationRoutes = require("./education.routes")
const feedRoutes = require("./feed.routes");

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/posts", postRoutes);
router.use("/posts/company", companyPostRoutes);
router.use("/connections", connectionRoutes)
router.use("/education",educationRoutes)
router.use("/feed", feedRoutes);
module.exports = router;
