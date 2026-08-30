module.exports = (sequelize, DataTypes) => {
  const FieldOfStudy = sequelize.define("FieldOfStudy", {
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
    tableName: "field_of_studies",
    timestamps: true,
  });

  return FieldOfStudy;
};