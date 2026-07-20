const bcrypt = require("bcryptjs");
const User = require("../models/User");
const ApiResponse = require("../utils/apiResponse");

const SALT_ROUNDS = 12;

const getAll = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const allowedSortFields = ["firstName", "lastName", "email", "role", "createdAt", "lastLoginAt"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password -refreshToken")
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    User.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, users, total, pageNum, limitNum);
};

const getById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password -refreshToken");
  if (!user) {
    return ApiResponse.error(res, "User not found", 404);
  }
  return ApiResponse.success(res, user);
};

const create = async (req, res) => {
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

  const { password: _, refreshToken: __, ...userObj } = user.toObject();
  return ApiResponse.success(res, userObj, 201);
};

const update = async (req, res) => {
  const { password, ...updateData } = req.body;

  if (password) {
    updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
  }

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password -refreshToken");

  if (!user) {
    return ApiResponse.error(res, "User not found", 404);
  }

  return ApiResponse.success(res, user);
};

const remove = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return ApiResponse.error(res, "User not found", 404);
  }
  return ApiResponse.success(res, { message: "User deleted successfully" });
};

module.exports = { getAll, getById, create, update, remove };
