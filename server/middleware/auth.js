const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiResponse = require("../utils/apiResponse");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return ApiResponse.error(res, "Not authorized, no token", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub).select("-password -refreshToken");

    if (!user) {
      return ApiResponse.error(res, "Not authorized, user not found", 401);
    }

    if (!user.isActive) {
      return ApiResponse.error(res, "Account has been deactivated", 403);
    }

    req.user = user;
    req.userSub = decoded.sub;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return ApiResponse.error(res, "Token expired", 401);
    }
    return ApiResponse.error(res, "Not authorized, token invalid", 401);
  }
};

const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.sub).select("-password -refreshToken");
      if (user && user.isActive) {
        req.user = user;
        req.userSub = decoded.sub;
      }
    } catch {
      // Token invalid, continue without user
    }
  }

  next();
};

module.exports = { protect, optionalAuth };
