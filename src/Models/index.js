const { DataTypes } = require('sequelize');

const dbInitalize = require('../Config/initializeDatabase');
const sequelize = require('../Config/sequelize.config');

const db = {};
db.sequelize = sequelize;

db.User = require('./user.model')(sequelize, DataTypes);
db.Profile = require('./profile.model')(sequelize, DataTypes);

// Associations
db.User.hasOne(db.Profile, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.Profile.belongsTo(db.User, { foreignKey: 'userId' });

// Sync
dbInitalize(sequelize, 'alter');

module.exports = db;