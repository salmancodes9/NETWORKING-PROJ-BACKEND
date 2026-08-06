const { Server } = require("socket.io");
const socketAuth = require("./socket.auth");

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // restrict later in production
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
}

module.exports = initSocket;
