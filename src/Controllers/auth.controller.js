const registerService = require("../services/auth/signUp.auth");
const loginService = require("../services/auth/login.auth");

const register = async (req, res) => {
  try {
    const result = await registerService(req.body);
    res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};


const login = async (req, res) => {
  try {
    const result = await loginService(req.body);
    res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
module.exports = { register, login };