const { Sequelize, DataTypes } = require("sequelize");

const dbInitalize = require("../Config/initializeDatabase");
const sequelize = require("../Config/sequelize.config");
const { CiPlay1 } = require("react-icons/ci");

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.User = require("./user.model")(sequelize, DataTypes);
db.Profile = require("./profile.model")(sequelize, DataTypes);
db.Message = require("./message.model")(sequelize, DataTypes);
db.Post = require("./post.model")(sequelize, DataTypes);

//education//
db.School = require('./education/school.model')(sequelize, DataTypes);
db.Degree = require('./education/degree.model')(sequelize, DataTypes);
db.FieldOfStudy = require('./education/fieldOfStudy.model')(sequelize, DataTypes);
db.Education = require('./education/education.model')(sequelize, DataTypes);
//END-Education//


//CONNECTIONS///
db.Connection = require("./connection.model")(sequelize, DataTypes)

db.User.hasMany(db.Connection,{foreignKey:'requesterId', as: 'sentRequests'});
db.User.hasMany(db.Connection,{foreignKey:'receiverId', as: 'receivedRequests'});
db.Connection.belongsTo(db.User, {foreignKey:'requesterId', as: 'requester'});
db.Connection.belongsTo(db.User,{foreignKey:'receiverId', as: 'receiver'})

//END-CONNECTIONS//

// Associations
db.User.hasOne(db.Profile, { foreignKey: "id", onDelete: "CASCADE" });

db.Profile.belongsTo(db.User, { foreignKey: "id", onDelete: "CASCADE" });

db.User.hasMany(db.Message, {
    foreignKey: "senderId",
    as: "sentMessages",
});

db.User.hasMany(db.Message, {
    foreignKey: "receiverId",
    as: "receivedMessages",
});

db.Message.belongsTo(db.User, {
    foreignKey: "senderId",
    as: "sender",
});

db.Message.belongsTo(db.User, {
    foreignKey: "receiverId",
    as: "receiver",
});

db.Profile.hasMany(db.Post, {
    foreignKey: "profileId",
    onDelete: "CASCADE",
});

db.Post.belongsTo(db.Profile, {
    foreignKey: "profileId",
});

//EDUCATION//

db.User.hasMany(db.Education, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.Education.belongsTo(db.User, { foreignKey: 'userId' });

db.School.hasMany(db.Education, { foreignKey: 'schoolId' });
db.Education.belongsTo(db.School, { foreignKey: 'schoolId' });

db.Degree.hasMany(db.Education, { foreignKey: 'degreeId' });
db.Education.belongsTo(db.Degree, { foreignKey: 'degreeId' });

db.FieldOfStudy.hasMany(db.Education, { foreignKey: 'fieldOfStudyId' });
db.Education.belongsTo(db.FieldOfStudy, { foreignKey: 'fieldOfStudyId' });
//END-EDUCATION//

// dbInitalize(sequelize, "alter");



module.exports = db;
