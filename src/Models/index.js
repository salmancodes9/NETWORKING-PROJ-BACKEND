const { Sequelize, DataTypes } = require("sequelize");

const dbInitalize = require("../Config/initializeDatabase"); 
const sequelize = require("../Config/sequelize.config");

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.User = require("./user.model")(sequelize, DataTypes);
db.Profile = require("./profile.model")(sequelize, DataTypes);
db.MemberProfile = require("./memberProfile.model")(sequelize,DataTypes)
db.Message = require("./message.model")(sequelize, DataTypes);
db.Post = require("./post.model")(sequelize, DataTypes);
db.Connection = require("./connection.model")(sequelize, DataTypes)
db.CompanyProfile = require('./companyProfile.model')(sequelize, DataTypes);

//education//
db.School = require('./education/school.model')(sequelize, DataTypes);
db.Degree = require('./education/degree.model')(sequelize, DataTypes);
db.FieldOfStudy = require('./education/fieldOfStudy.model')(sequelize, DataTypes);
db.Education = require('./education/education.model')(sequelize, DataTypes);
//END-Education//

require('./associations')(db); // ← call the separated associations

dbInitalize(sequelize, "alter");



module.exports = db;
