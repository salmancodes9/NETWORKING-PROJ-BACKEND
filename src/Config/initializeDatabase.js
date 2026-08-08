module.exports = async (sequelize, SyncMode = "none", tableAlter) => {
    try {
        await sequelize.authenticate();

        if (SyncMode === "alter") {
            await sequelize.sync({ alter: true });
        } else if (
            SyncMode === "force" &&
            process.env.ENVIRONMENT === "development"
        ) {
            await sequelize.sync({ force: true });
        } else {
            await sequelize.sync();
        }

        console.log("Database connection established");
    } catch (err) {
        console.log("Database Error Found:", err);
    }
};


// module.exports = async (sequelize, SyncMode = "none", tableAlter) => {
//   try {
//     await sequelize.authenticate();
//     if (SyncMode === "alter") {
//       await sequelize.sync();
//     } else if (SyncMode === "force" && process.env.ENVIRONMENT === "development") {
//       await sequelize.sync({ force: true });
//     } else if (tableAlter) {
//       await tableAlter.sync({ alter: true });
//     }
//     console.log("Database connection established")
//   } catch (err) {
//     console.log("Databse Error Found:" , err)
//   }
// };
