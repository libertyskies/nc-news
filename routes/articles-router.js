const express = require("express");
const {
  getCommentsByArticleId,
  postComment,
} = require("../controllers/comments.controller");
const {
  getArticleById,
  getArticle,
  patchArticle,
} = require("../controllers/articles.controller");

const articleRouter = express.Router();

articleRouter.route("/").get(getArticle);

articleRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articleRouter;
