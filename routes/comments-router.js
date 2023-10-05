const express = require("express");
const { deleteComment } = require("../controllers/comments.controller");

const commentsRouter = express.Router();

commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;
