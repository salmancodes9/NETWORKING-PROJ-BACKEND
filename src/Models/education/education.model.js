module.exports = (sequelize, DataTypes) => {
  const Education = sequelize.define("Education", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    memberProfileId: { type: DataTypes.INTEGER, allowNull: false },
    schoolId: { type: DataTypes.INTEGER, allowNull: false },
    degreeId: { type: DataTypes.INTEGER, allowNull: true },
    fieldOfStudyId: { type: DataTypes.INTEGER, allowNull: true },
    startDate: { type: DataTypes.DATEONLY, allowNull: true },
    endDate: { type: DataTypes.DATEONLY, allowNull: true },
  }, { tableName: "educations", timestamps: true });
  return Education;
};