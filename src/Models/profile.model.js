module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define("Profile", {
   
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profilePicUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId:{
        type: DataTypes.INTEGER
    }
  
  },{
    tableName: "profile",
    timeStamps: true
  });

  return Profile;
};