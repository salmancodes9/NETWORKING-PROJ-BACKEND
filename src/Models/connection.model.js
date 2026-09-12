module.exports = (sequelize, DataTypes) => {
  const Connection = sequelize.define("Connection", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    requesterMemberProfileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverMemberProfileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
    },
  }, {
    tableName: "connections",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["requesterMemberProfileId", "receiverMemberProfileId"],
        name: "unique_connection_pair", // ← explicit short name fixes the length issue
      },
    ],
  });

  return Connection;
};