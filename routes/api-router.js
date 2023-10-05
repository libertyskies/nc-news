const { getEndpoints } = require("../controllers/endpoints.controller");

const topicsRouter = require("./topics-router");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const usersRouter = require("./users-router");

const apiRouter = require("express").Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);

apiRouter.use("/", getEndpoints);

module.exports = apiRouter;
