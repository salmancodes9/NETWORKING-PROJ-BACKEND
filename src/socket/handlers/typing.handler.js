const { getUserSocketId } = require("../utils/onlineUsers");

const registerTypingHandler = (io, socket) => {
  socket.on("typing", ({ receiverId, isTyping = true }) => {
    if (!receiverId) {
      return;
    }

    const receiverSocketId = getUserSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", {
        senderId: socket.userId,
        isTyping,
      });
    }
  });
};

module.exports = registerTypingHandler;