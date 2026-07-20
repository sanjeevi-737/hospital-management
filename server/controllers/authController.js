const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateTokens, verifyRefreshToken } = require("../utils/generateToken");
const ApiResponse = require("../utils/apiResponse");

const SALT_ROUNDS = 12;

const sanitizeUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

const register = async (req, res) => {
  const { email, password, firstName, lastName, phone, role, hospitalId } = req.body;

  const existing = await User.findOne({ email, hospitalId });
  if (existing) {
    return ApiResponse.error(res, "User with this email already exists in this hospital", 409);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    phone,
    role,
    hospitalId,
  });

  const tokens = generateTokens(user);

  user.refreshToken = await bcrypt.hash(tokens.refreshToken, SALT_ROUNDS);
  await user.save({ validateBeforeSave: false });

  return ApiResponse.success(
    res,
    {
      user: sanitizeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
    201
  );
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user) {
    return ApiResponse.error(res, "Invalid email or password", 401);
  }

  if (!user.isActive) {
    return ApiResponse.error(res, "Account has been deactivated", 403);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return ApiResponse.error(res, "Invalid email or password", 401);
  }

  const tokens = generateTokens(user);

  user.refreshToken = await bcrypt.hash(tokens.refreshToken, SALT_ROUNDS);
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  return ApiResponse.success(res, {
    user: sanitizeUser(user),
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    return ApiResponse.error(res, "Invalid or expired refresh token", 401);
  }

  const user = await User.findById(decoded.sub).select("+refreshToken");
  if (!user) {
    return ApiResponse.error(res, "User not found", 401);
  }

  if (!user.isActive) {
    return ApiResponse.error(res, "Account has been deactivated", 403);
  }

  if (!user.refreshToken) {
    return ApiResponse.error(res, "Refresh token not found. Please log in again.", 401);
  }

  const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!isMatch) {
    return ApiResponse.error(res, "Refresh token does not match. Please log in again.", 401);
  }

  const tokens = generateTokens(user);

  user.refreshToken = await bcrypt.hash(tokens.refreshToken, SALT_ROUNDS);
  await user.save({ validateBeforeSave: false });

  return ApiResponse.success(res, {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
};

const logout = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return ApiResponse.error(res, "User not found", 404);
  }

  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });

  return ApiResponse.success(res, { message: "Logged out successfully" });
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  if (!user) {
    return ApiResponse.error(res, "User not found", 404);
  }

  return ApiResponse.success(res, user);
};

module.exports = { register, login, refreshToken, logout, getProfile };
