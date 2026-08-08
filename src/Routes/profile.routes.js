const express = require("express");
const router = express.Router();

const {
  createProfile,
  myProfile,
} = require("../Controllers/profile.controller/basicProfile.controller");
const authenticate = require("../Middleware/protectClinet");
const { upload, pickFirstUploadedFile } = require("../Utils/upload");

router.post(
  "/createProfile",
  authenticate,
  upload.any(),
  pickFirstUploadedFile,
  createProfile,
);
router.get("/myProfile", authenticate, myProfile);

module.exports = router;
