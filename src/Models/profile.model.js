module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define(
    "Profile",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },

      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      profilePicUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "profile",
      timestamps: true,
    }
  );

  return Profile;
};



// module.exports = (sequelize, DataTypes) => {
//   const Profile = sequelize.define("Profile", {
   
//     bio: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     profilePicUrl: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     userId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         unique: true,
//     }
  
//   },{
//     tableName: "profile",
//     timeStamps: true
//   });

//   return Profile;
// };