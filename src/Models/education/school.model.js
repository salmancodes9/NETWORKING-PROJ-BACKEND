module.exports = (sequelize, DataTypes) => {
  const School = sequelize.define("School", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: "schools",
    timestamps: true,
  });

  return School;
};