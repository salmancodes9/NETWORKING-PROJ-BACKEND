const db = require("../../Models");

const acceptRequest = async (userId, connectionId) => {
  const connection = await db.Connection.findByPk(connectionId);

  if (!connection) throw new Error("Connection request not found");
  if (connection.receiverId !== userId) throw new Error("Not authorized to accept this request");
  if (connection.status !== "pending") throw new Error("Request is not pending");

  await connection.update({ status: "accepted" });
  return { message: "Connection accepted", connection };
};

module.exports = acceptRequest;