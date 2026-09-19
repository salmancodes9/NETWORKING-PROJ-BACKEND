const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // adjust to match your existing multer setup

const { getMyProfile, getProfileByUserId, updateProfile, updateProfilePicture } = require("../Controllers/memberProfile.controller");
const authenticate = require("../Middleware/protectClinet");

router.get("/me", authenticate, getMyProfile);
router.get("/:userId", authenticate, getProfileByUserId);
router.put("/me", authenticate, updateProfile);
router.post("/me/picture", authenticate, upload.single("image"), updateProfilePicture);

module.exports = router;