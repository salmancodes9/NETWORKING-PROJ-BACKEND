const db = require("../../Models");

const deliverPendingMessages = async (io, socket) => {
  const pendingMessages = await db.Message.findAll({
    where: {
      receiverId: socket.userId,
      status: "sent", // never delivered yet
    },
  });

  if (pendingMessages.length > 0) {
    for (const message of pendingMessages) {
      socket.emit("receiveMessage", message);
      await message.update({ status: "delivered" });
    }
    console.log(`Delivered ${pendingMessages.length} pending messages to user ${socket.userId}`);
  }
};

module.exports = deliverPendingMessages;