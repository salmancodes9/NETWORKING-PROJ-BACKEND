const db = require("../Models");
const {
  validateSignupInput,
  validateLoginInput,
} = require("../Utils/validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const createAccessToken = (user) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "4h" },
  );
};

const createRefreshToken = (user) => {
  if (!JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );
};

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
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    const { email, password } = cleaned;
    const existingUser = await db.User.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(401).json({ message: "User does not exist" });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createAccessToken(existingUser);
    const refreshToken = createRefreshToken(existingUser);

    await existingUser.update({ refreshToken });

    return res.status(200).json({
      message: "Logged in successfully",
      token,
      refreshToken,
      user: {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Login failed", error: err.message });
  }
};

const refresh = async (req, res) => {
  try {
    let refreshToken = req.body?.refreshToken;

    if (!refreshToken) {
      const authorizationHeader =
        req.headers.authorization || req.get("authorization");
      if (authorizationHeader?.startsWith("Bearer ")) {
        refreshToken = authorizationHeader.replace("Bearer ", "").trim();
      }
    }

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is missing" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Refresh token does not match" });
    }

    const token = createAccessToken(user);

    return res.status(200).json({
      message: "Token refreshed successfully",
      token,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Refresh failed", error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user?.id || req.body?.userId;

    if (!userId) {
      return res.status(400).json({ message: "User id is required" });
    }

    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({ refreshToken: null });

    return res.status(200).json({
      message: "Logged out successfully",
      userId: user.id,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Logout failed", error: err.message });
  }
};

module.exports = { register, login, refresh, logout };
