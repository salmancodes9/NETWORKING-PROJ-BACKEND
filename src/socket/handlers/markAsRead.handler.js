const db = require("../../Models");
const { getUserSocketId } = require("../utils/onlineUsers");

const registerMarkAsReadHandler = (io, socket) => {
  socket.on("markAsRead", async ({ senderId }) => {
    await db.Message.update(
      { status: "read" },
      {
        where: {
          senderId,
          receiverId: socket.userId,
          status: { [db.Sequelize.Op.ne]: "read" },
        },
      }
    );

    const senderSocketId = getUserSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesRead", { readBy: socket.userId });
    }
  });
};

module.exports = registerMarkAsReadHandler;