const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleById,
  getArticle,
  patchArticle,
} = require("./controllers/articles.controller");
const {
  handleCustomErrors,
  handleServerErrors,
  handlePSQLErrors,
} = require("./controllers/errors.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");
const {
  getCommentsByArticleId,
  postComment,
  deleteComment,
} = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticle);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.patch("/api/articles/:article_id", patchArticle);

app.get("/api/users", getUsers);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handleCustomErrors);

app.use(handlePSQLErrors);

app.use(handleServerErrors);

module.exports = app;
