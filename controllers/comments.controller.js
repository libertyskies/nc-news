const {
  fetchCommentsByArticleId,
  createComment,
  removeComment,
  updateComment,
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

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchComment = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;
  updateComment(inc_votes, comment_id)
    .then((updatedComment) => {
      res.status(200).send({ comment: updatedComment });
    })
    .catch((err) => {
      next(err);
    });
};
