const { Sequelize, DataTypes } = require("sequelize");
module.exports = (db) => {
  // User ↔ Profile
  db.User.hasOne(db.Profile, { foreignKey: "userId", onDelete: "CASCADE" });
  db.Profile.belongsTo(db.User, { foreignKey: "userId" });

  // Profile ↔ MemberProfile
  db.Profile.hasOne(db.MemberProfile, { foreignKey: "profileId" });
  db.MemberProfile.belongsTo(db.Profile, { foreignKey: "profileId" });

  // Profile ↔ Message
  db.Profile.hasMany(db.Message, { foreignKey: "senderProfileId", as: "sentMessages" });
  db.Profile.hasMany(db.Message, { foreignKey: "receiverProfileId", as: "receivedMessages" });
  db.Message.belongsTo(db.Profile, { foreignKey: "senderProfileId", as: "sender" });
  db.Message.belongsTo(db.Profile, { foreignKey: "receiverProfileId", as: "receiver" });

  // Profile ↔ Post
  db.Profile.hasMany(db.Post, { foreignKey: "profileId", onDelete: "CASCADE" });
  db.Post.belongsTo(db.Profile, { foreignKey: "profileId" });

  //CONNECTIONS//
  db.MemberProfile.hasMany(db.Connection, { foreignKey: "requesterMemberProfileId", as: "sentRequests" });
  db.MemberProfile.hasMany(db.Connection, { foreignKey: "receiverMemberProfileId", as: "receivedRequests" });
  db.Connection.belongsTo(db.MemberProfile, { foreignKey: "requesterMemberProfileId", as: "requester" });
  db.Connection.belongsTo(db.MemberProfile, { foreignKey: "receiverMemberProfileId", as: "receiver" });
  //END-CONNECTIONS//

  //EDUCATION//
  db.MemberProfile.hasMany(db.Education, { foreignKey: "memberProfileId", onDelete: "CASCADE" });
  db.Education.belongsTo(db.MemberProfile, { foreignKey: "memberProfileId" });

  db.School.hasMany(db.Education, { foreignKey: "schoolId" });
  db.Education.belongsTo(db.School, { foreignKey: "schoolId" });

  db.Degree.hasMany(db.Education, { foreignKey: "degreeId" });
  db.Education.belongsTo(db.Degree, { foreignKey: "degreeId" });

  db.FieldOfStudy.hasMany(db.Education, { foreignKey: "fieldOfStudyId" });
  db.Education.belongsTo(db.FieldOfStudy, { foreignKey: "fieldOfStudyId" });
  //END-EDUCATION//
};