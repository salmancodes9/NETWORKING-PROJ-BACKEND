module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define(
    "Profile",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      profileType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "member",
      },
    },
    { tableName: "profile", timestamps: true },
  );
  return Profile;
};
