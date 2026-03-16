const { HttpError } = require("../utils/http-error");

function requireUser(req, _res, next) {
  const rawUserId = req.header("x-user-id");

  if (!rawUserId) {
    return next(new HttpError(401, "Missing x-user-id header."));
  }

  const userId = Number(rawUserId);

  if (!Number.isInteger(userId) || userId <= 0) {
    return next(new HttpError(400, "x-user-id must be a positive integer."));
  }

  req.user = { id: userId };
  return next();
}

module.exports = { requireUser };
