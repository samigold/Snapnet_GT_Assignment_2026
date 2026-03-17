const express = require("express");
const {
  validateCreateTaskPayload,
  validateUpdateTaskPayload,
  validateStatusPayload,
  validateTaskIdParam,
  validateTaskFilterQuery
} = require("../utils/validators");
const {
  createTask,
  listTasks,
  updateTask,
  updateTaskStatus,
  unassignTask,
  assignTask,
  deleteTask
} = require("../services/task-service");

const router = express.Router();

router.post("/", (req, res, next) => {
  try {
    validateCreateTaskPayload(req.body);
    const task = createTask(req.body, req.user.id);
    return res.status(201).json(task);
  } catch (err) {
    return next(err);
  }
});

router.get("/", (req, res, next) => {
  try {
    const filters = validateTaskFilterQuery(req.query);
    const tasks = listTasks(filters, req.user.id);
    if (tasks.length === 0) {
      return res.status(200).json({ message: "No tasks found." });
    }
    return res.status(200).json(tasks);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", (req, res, next) => {
  try {
    const taskId = validateTaskIdParam(req.params.id);
    validateUpdateTaskPayload(req.body);
    const task = updateTask(taskId, req.body, req.user.id);
    return res.status(200).json(task);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id/status", (req, res, next) => {
  try {
    const taskId = validateTaskIdParam(req.params.id);
    validateStatusPayload(req.body);
    const task = updateTaskStatus(taskId, req.body.status, req.user.id);
    return res.status(200).json(task);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id/unassign", (req, res, next) => {
  try {
    const taskId = validateTaskIdParam(req.params.id);
    const task = unassignTask(taskId, req.user.id);
    return res.status(200).json(task);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id/assign", (req, res, next) => {
    try {
        const taskId = validateTaskIdParam(req.params.id);
        const { newAssigneeId } = req.body;
        if (newAssigneeId === undefined) {
            throw new HttpError(400, "newAssigneeId is required to assign a task.");
        }
        const task = assignTask(taskId, newAssigneeId, req.user.id);
        return res.status(200).json(task);
    } catch (err) {
        return next(err);
    }
});

router.delete("/:id", (req, res, next) => {
  try {
    const taskId = validateTaskIdParam(req.params.id);
    deleteTask(taskId, req.user.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

module.exports = { tasksRouter: router };
