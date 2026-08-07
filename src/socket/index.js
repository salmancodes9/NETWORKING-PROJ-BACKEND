const { Sequelize, DataTypes } = require("sequelize");
const { Server, Socket } = require("socket.io");
const socketAuth = require("./socket.auth");
const { addUser, removeUser } = require("./utils/onlineUsers");
const handleMessage = require("./handlers/message.handler");
const deliverPendingMessages = require("./handlers/deliverPendingMessage.handler");
const registerMarkAsReadHandler = require("./handlers/markAsRead.handler");
const registerTypingHandler = require("./handlers/typing.handler");
function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // restrict later in production
    },
  });

  io.use(socketAuth);

  io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.userId}`);
    addUser(socket.userId, socket.id);
    handleMessage(io, socket);

    await deliverPendingMessages(io, socket);

    registerMarkAsReadHandler(io, socket);
    registerTypingHandler(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      removeUser(socket.userId);
    });
  });

  return io;
}

module.exports = initSocket;
