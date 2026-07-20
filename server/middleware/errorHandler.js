const ApiResponse = require("../utils/apiResponse");

const errorHandler = (err, req, res, _next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(`[Error] ${err.message}`);

  if (err.name === "CastError") {
    return ApiResponse.error(res, "Resource not found", 404);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return ApiResponse.error(res, `Duplicate value for field '${field}'`, 400);
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return ApiResponse.error(res, "Validation Error", 400, messages);
  }

  if (err.name === "JsonWebTokenError") {
    return ApiResponse.error(res, "Invalid token", 401);
  }

  if (err.name === "TokenExpiredError") {
    return ApiResponse.error(res, "Token expired", 401);
  }

  return ApiResponse.error(res, error.message || "Internal Server Error", error.statusCode || 500);
};

module.exports = errorHandler;
