const jwt =  require("jsonwebtoken");
const db = require("../../Models")
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

module.exports = async(refreshToken) =>{
    if(!refreshToken) throw new Error("Refresh token is missing");
    let decoded;
    try{
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    }catch(err){
        console.log("JWT verify failed", err.message);
        throw new Error("Invalid or Expired refresh token")

    }
    const user = await db.User.findByPk(decoded.id);
    if(!user) throw new Error("user not found")

        console.log("DB refreshToken:", user.refreshToken)
        console.log("sent refreshToken:",user.refreshToken)
        if (user.refreshToken !== refreshToken){
            throw new Error("refresh token doesnt match")
        }

        const newAccessToken = jwt.sign(
            {id: user.id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: "4h"}
        );
        return{token: newAccessToken}
}