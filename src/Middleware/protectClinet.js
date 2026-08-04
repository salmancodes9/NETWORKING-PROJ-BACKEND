const db = require("../Models/index.js");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header["authorization"];
    const token = authHeader?.startsWith("Bearer")
      ? authHeader.split("")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Session expired, please log in again" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }

    const currentUser = await db.user.findOne({ where: { id: decoded.id } });
    if (!currentUser) {
      return res.status(401).json({ message: "user no longer exists" });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    return res.status(401).json({ message: "Authentication failed" });
  }
};
