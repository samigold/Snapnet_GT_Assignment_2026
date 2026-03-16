const express = require("express");
const { tasksRouter } = require("./routes/tasks");
const { requireUser } = require("./middleware/auth");
const { errorHandler, notFoundHandler } = require("./middleware/error-handler");

const app = express();

app.use(express.json());
app.use(requireUser);
app.use("/tasks", tasksRouter);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app };
