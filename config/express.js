const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config.json");

module.exports = () => {
  const app = express();

  app.set("port", process.env.PORT || config.server.port);

  app.use(bodyParser.json());

  return app;
};
