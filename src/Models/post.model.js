module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    profileId: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: true },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, { tableName: "posts", timestamps: true });
  return Post;
};