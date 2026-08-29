const db = require("../../Models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_SECRET;


module.exports = async ({ email, password }) => {
  if (!email || !password) throw new Error("email field is empty");
  if (typeof password !== "string" || password.length < 8)
    throw new Error("Password must be strong");
  email = String(email).trim().toLowerCase();
  const existingUser = await db.User.findOne({ where: { email } });

  if (!existingUser) throw new Error("User doesnt exist");
  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if(!passwordMatch) throw new Error("password is incorrect")
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
      {id: existingUser.id},
      process.env.JWT_REFRESH_SECRET,
      {expiresIn :"7d"}
    )
    await existingUser.update({refreshToken})
    return { message: "logged in successfully", token,refreshToken };
  }
 
};
