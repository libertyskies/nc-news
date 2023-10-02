const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const {
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
