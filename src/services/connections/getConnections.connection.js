const db = require("../../Models");
const { Op } = db.Sequelize;

const getConnections = async (userId) => {
  const connections = await db.Connection.findAll({
    where: {
      status: "accepted",
      [Op.or]: [
        { requesterId: userId },
        { receiverId: userId },
      ],
    },
    include: [
      { model: db.User, as: "requester", attributes: ["id", "name", "email"] },
      { model: db.User, as: "receiver", attributes: ["id", "name", "email"] },
    ],
  });

  const otherUsers = connections.map((conn) => {
    const isRequester = conn.requesterId === userId;
    return isRequester ? conn.receiver : conn.requester;
  });

  return otherUsers;
};

module.exports = getConnections;