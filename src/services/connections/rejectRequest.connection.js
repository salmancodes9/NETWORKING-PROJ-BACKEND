const db = require("../../Models");

const rejectRequest = async (userId, connectionId) => {
  const connection = await db.Connection.findByPk(connectionId);

  if (!connection) throw new Error("Connection request not found");
  if (connection.receiverId !== userId) throw new Error("Not authorized to reject this request");
  if (connection.status !== "pending") throw new Error("Request is not pending");

  await connection.update({ status: "rejected" });
  return { message: "Connection request rejected", connection };
};

module.exports = rejectRequest;