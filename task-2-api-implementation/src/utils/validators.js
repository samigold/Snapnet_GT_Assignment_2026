const { HttpError } = require("./http-error");

const PRIORITIES = ["low", "medium", "high"];
const STATUSES = ["pending", "in-progress", "completed"];

function assertPositiveInteger(value, fieldName) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new HttpError(400, `${fieldName} must be a positive integer.`);
  }
}

function assertAllowedString(value, fieldName, allowedValues) {
  if (typeof value !== "string" || !allowedValues.includes(value)) {
    throw new HttpError(400, `${fieldName} must be one of: ${allowedValues.join(", ")}.`);
  }
}

function validateCreateTaskPayload(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Request body must be a JSON object.");
  }

  const { title, priority, assignedTo, assignedBy } = body;

  if (typeof title !== "string" || title.trim().length === 0) {
    throw new HttpError(400, "title is required and must be a non-empty string.");
  }

  assertAllowedString(priority, "priority", PRIORITIES);
  assertPositiveInteger(assignedTo, "assignedTo");
  assertPositiveInteger(assignedBy, "assignedBy");
}

function validateUpdateTaskPayload(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Request body must be a JSON object.");
  }

  const allowedFields = ["title", "priority"];
  const incomingFields = Object.keys(body);

  if (incomingFields.length === 0) {
    throw new HttpError(400, "At least one field is required: title or priority.");
  }

  const disallowedField = incomingFields.find((field) => !allowedFields.includes(field));
  if (disallowedField) {
    throw new HttpError(400, `Field '${disallowedField}' is not allowed in this route.`);
  }

  if (Object.prototype.hasOwnProperty.call(body, "title")) {
    if (typeof body.title !== "string" || body.title.trim().length === 0) {
      throw new HttpError(400, "title must be a non-empty string.");
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "priority")) {
    assertAllowedString(body.priority, "priority", PRIORITIES);
  }
}

function validateStatusPayload(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Request body must be a JSON object.");
  }

  const keys = Object.keys(body);
  if (keys.length !== 1 || !Object.prototype.hasOwnProperty.call(body, "status")) {
    throw new HttpError(400, "Only status can be updated in this route.");
  }

  assertAllowedString(body.status, "status", STATUSES);
}

function validateTaskIdParam(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, "Task id must be a positive integer.");
  }
  return id;
}

function validateTaskFilterQuery(query) {
  const parsed = {};

  if (query.assignedTo !== undefined) {
    const assignedTo = Number(query.assignedTo);
    assertPositiveInteger(assignedTo, "assignedTo filter");
    parsed.assignedTo = assignedTo;
  }

  if (query.status !== undefined) {
    assertAllowedString(query.status, "status filter", STATUSES);
    parsed.status = query.status;
  }

  return parsed;
}

module.exports = {
  PRIORITIES,
  STATUSES,
  validateCreateTaskPayload,
  validateUpdateTaskPayload,
  validateStatusPayload,
  validateTaskIdParam,
  validateTaskFilterQuery
};
