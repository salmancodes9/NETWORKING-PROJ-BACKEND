const express = require("express");
const router = express.Router();

const { send, accept, reject, getConnections, getPendingRequests } = require("../Controllers/connection.controller");
const authenticate = require("../Middleware/protectClinet");

router.post("/send/:receiverId", authenticate, send);
router.post("/accept/:connectionId", authenticate, accept);
router.post("/reject/:connectionId", authenticate, reject);
router.get("/", authenticate, getConnections);
router.get("/pending", authenticate, getPendingRequests);

module.exports = router;