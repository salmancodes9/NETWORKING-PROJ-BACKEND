require("dotenv").config({ path: "./.env" });
require("./src/Models/index");
const http = require("http");

const { app } = require("./app");
const initSocket = require("./src/socket/index");
const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
