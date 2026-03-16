const { store } = require("../data/store");
const { HttpError } = require("../utils/http-error");

function ensureUserExists(userId) {
  if (!store.users.includes(userId)) {
    throw new HttpError(404, `User ${userId} not found.`);
  }
}

function getTaskByIdOrThrow(taskId) {
  const task = store.tasks.find((item) => item.id === taskId);
  if (!task) {
    throw new HttpError(404, `Task ${taskId} not found.`);
  }
  return task;
}

function assertIsAssigner(task, userId) {
  if (task.assignedBy !== userId) {
    throw new HttpError(403, "Only the assigner can perform this action.");
  }
}

function assertIsAssignee(task, userId) {
  if (task.assignedTo !== userId) {
    throw new HttpError(403, "Only the assignee can perform this action.");
  }
}

function createTask(payload, actorUserId) {
  if (payload.assignedBy !== actorUserId) {
    throw new HttpError(403, "assignedBy must match x-user-id.");
  }

  ensureUserExists(payload.assignedBy);
  ensureUserExists(payload.assignedTo);

  const task = {
    id: store.nextTaskId++,
    title: payload.title.trim(),
    priority: payload.priority,
    status: "pending",
    assignedTo: payload.assignedTo,
    assignedBy: payload.assignedBy,
    createdAt: new Date().toISOString()
  };

  store.tasks.push(task);
  return task;
}

function listTasks(filters) {
  return store.tasks.filter((task) => {
    if (filters.assignedTo !== undefined && task.assignedTo !== filters.assignedTo) {
      return false;
    }

    if (filters.status !== undefined && task.status !== filters.status) {
      return false;
    }

    return true;
  });
}

function updateTask(taskId, updates, actorUserId) {
  const task = getTaskByIdOrThrow(taskId);
  assertIsAssigner(task, actorUserId);

  if (updates.title !== undefined) {
    task.title = updates.title.trim();
  }

  if (updates.priority !== undefined) {
    task.priority = updates.priority;
  }

  return task;
}

function updateTaskStatus(taskId, status, actorUserId) {
  const task = getTaskByIdOrThrow(taskId);
  assertIsAssignee(task, actorUserId);
  task.status = status;
  return task;
}

function unassignTask(taskId, actorUserId) {
  const task = getTaskByIdOrThrow(taskId);
  assertIsAssigner(task, actorUserId);
  task.assignedTo = null;
  task.status = "pending";
  return task;
}

function deleteTask(taskId, actorUserId) {
  const task = getTaskByIdOrThrow(taskId);
  assertIsAssigner(task, actorUserId);

  const index = store.tasks.findIndex((item) => item.id === taskId);
  store.tasks.splice(index, 1);
}

module.exports = {
  createTask,
  listTasks,
  updateTask,
  updateTaskStatus,
  unassignTask,
  deleteTask
};
