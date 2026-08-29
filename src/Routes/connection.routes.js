const express = require("express")
const router =  express.Router();

const { send , accept } = require("../Controllers/connection.controller");
const authenticate = require("../Middleware/protectClinet");

router.post("/send/:receiverId",authenticate, send);
router.post("/accept/:connectionId", authenticate, accept)
router.post("/reject/:connectionId", authenticate, reject);
module.exports = router;