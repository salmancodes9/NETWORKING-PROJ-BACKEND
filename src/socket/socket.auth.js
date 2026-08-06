const jwt = require("jsonwebtoken")

const socketAuth = (socket, next )=>{
    const headerToken = socket.handshake.headers?.auth;
    const authorizationHeader = socket.handshake.headers?.authorization;
        const authToken = socket.handshake.auth?.token;
        const token = authToken || headerToken || (authorizationHeader?.startsWith("Bearer ")
            ? authorizationHeader.slice(7)
            : authorizationHeader);

    if(!token){
        return next(new Error("Authentication error:No token provided"));
        
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();




    }catch(err){
    next(new Error("Authentication error: Invalid token"));

    }
}
module.exports = socketAuth;