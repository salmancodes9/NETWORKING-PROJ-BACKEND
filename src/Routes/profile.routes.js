const express = require("express")
const router =  express.Router();

const { createProfile } = require("../Controllers/profile.controller/basicProfile.controller")
const authenticate = require("../Middleware/protectClinet")
const { upload, pickFirstUploadedFile } = require("../Utils/upload")

router.post("/", authenticate, upload.any(), pickFirstUploadedFile, createProfile)

module.exports = router;