const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { handleCustomErrors } = require("./controllers/errors.controller");
const { getArticleById } = require("./controllers/articles.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handleCustomErrors);

module.exports = app;
