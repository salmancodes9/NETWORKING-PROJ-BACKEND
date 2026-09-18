const db = require("../Models");
const {
  validateSignupInput,
  validateLoginInput,
} = require("../Utils/validator");
const messageModel = require("../Models/message.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../services/auth/login.auth");

const register = async (req, res) => {
  try {
    const { isValid, cleaned, errors } = validateSignupInput(req.body);

    if (!isValid) {
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    let { email, password, role, name, companyName } = cleaned;

    const allowedRoles = ["member", "company"];
    if (!role || !allowedRoles.includes(role)) {
      role = "member";
    }

    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.User.create({
      email,
      password: hashedPassword,
      role,
    });

    const profile = await db.Profile.create({
      userId: user.id,
      profileType: role,
    });

    if (role === "member") {
      await db.MemberProfile.create({
        profileId: profile.id,
        name: name || null,
      });
    } else if (role === "company") {
      if (!companyName) {
        return res.status(400).json({ message: "Company name is required" });
      }
      await db.CompanyProfile.create({ profileId: profile.id, companyName });
    }

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email, role },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Signup failed", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { isValid, cleaned, errors } = validateLoginInput(req.body);
    if (!isValid) {
      return res.status(400).json({ message: "validation failed", errors });
    }
    const { email, password } = cleaned;
    const existingUser = await db.User.findOne({ where: { email } });
    if (!existingUser) throw new Error("User doesnt exist");
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) throw new Error("password is incorrect");
    if (passwordMatch) {
      if (!JWT_SECRET) throw new Error("JWT_SECRET is not configured");
      const token = jwt.sign(
        {
          id: existingUser.id,
          email: existingUser.email,
        },
        JWT_SECRET,
        {
          expiresIn: "4h",
        },
      );

      const refreshToken = jwt.sign(
        { id: existingUser.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" },
      );
      await existingUser.update({refreshToken})
  }
  }catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

module.exports = { register,login };
