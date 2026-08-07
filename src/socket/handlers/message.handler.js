const db = require("../../Models");
const { getUserSocketId } = require("../utils/onlineUsers");

const handleMessage = (io, socket) => {
  socket.on("sendMessage", async ({ receiverId, text }) => {
    console.log("sendMessage triggered:", {
      senderId: socket.userId,
      receiverId,
      text,
    });

    try {
      const message = await db.Message.create({
        senderId: socket.userId,
        receiverId,
        text,
      });
      console.log("Message saved to DB:", message.id);

      const receiverSocketId = getUserSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", message);

        console.log("Message emitted to receiver");
        await message.update({ status: "delivered" });
        socket.emit("messageStatusUpdate", {
          messageId: message.id,
          status: "delivered",
        });
      } else {
        console.log(
          "Recevier not online, message saved but not delivered live",
        );
      }
      socket.emit("messageSent", message);
      console.log(message.text);
    } catch (err) {
      console.log("Error in sendMessage:", err.message);

      socket.emit("errorMessage", { message: "Failed to send message" });
    }
  });
};

module.exports = handleMessage;
