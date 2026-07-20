const Department = require("../models/Department");
const Doctor = require("../models/Doctor");
const ApiResponse = require("../utils/apiResponse");

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const filter = {};
    if (req.query.hospitalId) {
      filter.hospitalId = req.query.hospitalId;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }

    const [departments, total] = await Promise.all([
      Department.find(filter)
        .populate("hospitalId", "name city")
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Department.countDocuments(filter),
    ]);

    return ApiResponse.paginated(res, departments, total, page, limit);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate("hospitalId", "name email phone city")
      .lean();

    if (!department) {
      return ApiResponse.error(res, "Department not found", 404);
    }

    return ApiResponse.success(res, department);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.create = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    return ApiResponse.success(res, department, 201);
  } catch (error) {
    if (error.code === 11000) {
      return ApiResponse.error(
        res,
        "A department with this code already exists in this hospital",
        409
      );
    }
    return ApiResponse.error(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!department) {
      return ApiResponse.error(res, "Department not found", 404);
    }

    return ApiResponse.success(res, department);
  } catch (error) {
    if (error.code === 11000) {
      return ApiResponse.error(
        res,
        "A department with this code already exists in this hospital",
        409
      );
    }
    return ApiResponse.error(res, error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return ApiResponse.error(res, "Department not found", 404);
    }

    await Promise.all([
      Doctor.deleteMany({ departmentId: department._id }),
      department.deleteOne(),
    ]);

    return ApiResponse.success(res, { message: "Department deleted" });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};
