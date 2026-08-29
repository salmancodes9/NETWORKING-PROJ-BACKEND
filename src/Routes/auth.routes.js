// auth.routes.js
const express = require("express");
const router = express.Router();
const { register, login, logout ,getMe, refresh} = require("../Controllers/auth.controller");
const authenticate = require("../Middleware/protectClinet")
router.post("/signup", register);
router.post("/login", login)
router.get("/getMe",authenticate, getMe)
router.post("/logout",authenticate, logout)
router.post("/refresh", refresh)

module.exports = router;
