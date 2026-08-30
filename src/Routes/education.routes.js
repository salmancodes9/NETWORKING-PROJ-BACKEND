const express = require("express")
const router = express.Router();


const { createEducation,getEducation} = require("../Controllers/education.controller")
const authenticate = require("../Middleware/protectClinet")
router.post("/create",authenticate,createEducation);
router.get("/get",authenticate, getEducation)

module.exports = router;