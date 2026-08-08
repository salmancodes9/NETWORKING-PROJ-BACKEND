const express = require("express");
const router = express.Router();

const {
  create,
  remove,
  getAll,
  getMine,
} = require("../Controllers/post.controller");
const authenticate = require("../Middleware/protectClinet");

router.post("/", authenticate, create);
router.delete("/:id", authenticate, remove);
router.get("/", authenticate, getAll);
router.get("/mine", authenticate, getMine);

module.exports = router;
