const {
  fetchCommentsByArticleId,
  createComment,
} = require("../models/comments.model");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const comment = req.body;
  const { article_id } = req.params;

  createComment(comment, article_id)
    .then((postedComment) => {
      res.status(201).send({ comment: postedComment });
    })
    .catch((err) => {
      next(err);
    });
};
