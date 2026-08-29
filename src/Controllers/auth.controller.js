const registerService = require("../services/auth/signUp.auth");
const loginService = require("../services/auth/login.auth");
const logoutService = require("../services/auth/logout.auth")
const refreshService = require("../services/auth/refresh.auth");

const register = async (req, res) => {
  try {
    const result = await registerService(req.body);
    res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

///

const login = async (req, res) => {
  try {
    const result = await loginService(req.body);
    res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
const getMe = async(req,res) =>{
  res.status(200).json({user: req.user})
};

///
const logout = async (req,res) =>{
  try{
    const result = await logoutService(req.user.id);
    return res.status(200).json({message:"loged out",loginService})
  }catch(err){
    return res.status(500)
    .json({message: "logout failed", error: err.message})
  }
};


/////
const refresh = async (req, res) => {
  try {
    const result = await refreshService(req.body.refreshToken);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = { register, login, logout, getMe, refresh };

