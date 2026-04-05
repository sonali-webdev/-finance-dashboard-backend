const { errorResponse } = require("../utils/response.utils");

const notFound = (req, res, next) => {
  return errorResponse(
    res,
    404,
    `Route not found: ${req.method} ${req.originalUrl}`,
  );
};

const globalErrorHandler = (err, req, res, next) => {
  console.error("🔴 Error:", err);

  if (err.code === "P2002") {
    return errorResponse(res, 409, "A record with this value already exists.", [
      { field: err.meta?.target, message: "Must be unique" },
    ]);
  }

  if (err.code === "P2025") {
    return errorResponse(res, 404, "Record not found.");
  }

  if (err.code === "P2003") {
    return errorResponse(
      res,
      400,
      "Invalid reference. Related record not found.",
    );
  }

  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, 401, "Invalid token.");
  }

  if (err.name === "TokenExpiredError") {
    return errorResponse(res, 401, "Token has expired. Please login again.");
  }

  if (err.name === "ValidationError") {
    return errorResponse(res, 400, "Validation failed.", err.errors);
  }

  return errorResponse(
    res,
    err.statusCode || 500,
    err.message || "Internal server error.",
  );
};

module.exports = { notFound, globalErrorHandler };
