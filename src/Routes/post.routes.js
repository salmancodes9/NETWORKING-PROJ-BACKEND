const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
  create,
  remove,
  getAll,
  getMine,
} = require("../Controllers/memberPost.controller");
const authenticate = require("../Middleware/protectClinet");

router.post("/", authenticate, upload.single("image"), create);
router.delete("/:id", authenticate, remove);
router.get("/", authenticate, getAll);
router.get("/mine", authenticate, getMine);

module.exports = router;
