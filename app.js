const express = require("express");
const {
  handleCustomErrors,
  handleServerErrors,
  handlePSQLErrors,
} = require("./controllers/errors.controller");
const apiRouter = require("./routes/api-router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handleCustomErrors);

app.use(handlePSQLErrors);

app.use(handleServerErrors);

module.exports = app;
