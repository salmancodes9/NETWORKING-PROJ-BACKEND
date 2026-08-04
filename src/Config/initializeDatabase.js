module.exports = async (sequelize, SyncMode = "none", tableAlter) => {
  try {
    await sequelize.authenticate();
    if (SyncMode === "alter") {
      await sequelize.sync({ alter: true });
    } else if (syncMode === "force" && process.env.ENVIRONMENT === "devlopment") {
        await sequelize.sync({alter:true})
    }else if(tableAlter){
        await tableAlter.sync({alter:true})
    }
    console.log("Database connection established")
  } catch (err) {
    console.log("Databse Error Found:" , err)
  }
};
