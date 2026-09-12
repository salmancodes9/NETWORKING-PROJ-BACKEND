module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("Message", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    senderProfileId: { type: DataTypes.INTEGER, allowNull: false },
    receiverProfileId: { type: DataTypes.INTEGER, allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM("sent", "delivered", "read"), defaultValue: "sent" },
  }, { tableName: "messages", timestamps: true });
  return Message;
};