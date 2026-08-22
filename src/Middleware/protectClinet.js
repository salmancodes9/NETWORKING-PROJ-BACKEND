const db = require("../Models/index.js");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token",decoded)
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Session expired, please log in again" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }

    const currentUser = await db.User.findOne({ where: { id: decoded.id } });
    console.log("Current user:", currentUser?.toJSON());
    if (!currentUser) {
      return res.status(401).json({ message: "user no longer exists" });
    }

    req.user = currentUser;
    console.log("Authenticated user ID:", req.user.id);
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = authenticate;
