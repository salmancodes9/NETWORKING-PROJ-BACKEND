const { Sequelize,DataTypes } = require('sequelize');

const dbInitalize = require('../Config/initializeDatabase');
const sequelize = require('../Config/sequelize.config');

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize

db.User = require('./user.model')(sequelize, DataTypes);
db.Profile = require('./profile.model')(sequelize, DataTypes);
db.Message =  require('./message.model')(sequelize, DataTypes)

// Associations
db.User.hasOne(db.Profile, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.Profile.belongsTo(db.User, { foreignKey: 'userId' });

db.User.hasMany(db.Message, { foreignKey: 'senderId', as: 'sentMessages' });
db.User.hasMany(db.Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
db.Message.belongsTo(db.User, { foreignKey: 'senderId', as: 'sender' });
db.Message.belongsTo(db.User, { foreignKey: 'receiverId', as: 'receiver' });

// Sync
dbInitalize(sequelize, 'alter');

module.exports = db;