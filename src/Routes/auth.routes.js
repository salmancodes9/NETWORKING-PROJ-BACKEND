// auth.routes.js
const express = require("express");
const router = express.Router();
const {
  register,
  // login,
  //  logout ,
  //  getMe,
  //  refresh
} = require("../Controllers/auth.controller");
const authenticate = require("../Middleware/protectClinet");
const { validateSignupInput } = require("../Utils/validator");

const signupValidation = (req, res, next) => {
  const { isValid, cleaned, errors } = validateSignupInput(req.body);

  if (!isValid) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  req.body = cleaned;
  return next();
};

router.post("/signup", signupValidation, register);

// router.post("/login", login)
// router.get("/getMe",authenticate, getMe)
// router.post("/logout",authenticate, logout)
// router.post("/refresh", refresh)

module.exports = router;
