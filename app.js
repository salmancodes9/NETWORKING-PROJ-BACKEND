const express = require("express");
const bodyParser = require("body-parser");


const app = express();

app.use(bodyParser.json());
const router = require('./src/Routes/routes');
app.use("/api", router);

module.exports = { app };
