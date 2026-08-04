require("dotenv").config({path: "./.env"});
require('./src/Models/index')
const {app} = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is runing on http://localhost:${PORT}`);

});




