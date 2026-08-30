module.exports = (sequelize, DataTypes) => {
  const Degree = sequelize.define("Degree", {
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
    tableName: "degrees",
    timestamps: true,
  });

  return Degree;
};