module.exports = (sequelize, DataTypes) => {
  const CompanyProfile = sequelize.define("CompanyProfile", {
    profileId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false, // shares Profile's id, same pattern as MemberProfile
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: "company_profile",
    timestamps: true,
  });

  return CompanyProfile;
};