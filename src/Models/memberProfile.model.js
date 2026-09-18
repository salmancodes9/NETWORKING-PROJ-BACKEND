module.exports = (sequelize, DataTypes) => {
  const MemberProfile = sequelize.define("MemberProfile", {
    profileId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profilePicUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: "member_profile",
    timestamps: true,
  });

  return MemberProfile;
};