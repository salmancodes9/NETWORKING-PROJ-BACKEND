// auth.routes.js
const express = require("express");
const router = express.Router();
const { register, login} = require("../Controllers/auth.controller");
const authticate = require("../Middleware/protectClinet")
router.post("/signup", register);
router.post("/login", login)

module.exports = router;