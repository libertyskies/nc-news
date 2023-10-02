const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { handleCustomErrors } = require("./controllers/errors.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handleCustomErrors);

module.exports = app;
