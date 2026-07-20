const Hospital = require("../models/Hospital");
const Department = require("../models/Department");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const User = require("../models/User");
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
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    const [hospitals, total] = await Promise.all([
      Hospital.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Hospital.countDocuments(filter),
    ]);

    return ApiResponse.paginated(res, hospitals, total, page, limit);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).lean();

    if (!hospital) {
      return ApiResponse.error(res, "Hospital not found", 404);
    }

    return ApiResponse.success(res, hospital);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.create = async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);
    return ApiResponse.success(res, hospital, 201);
  } catch (error) {
    if (error.code === 11000) {
      return ApiResponse.error(res, "Hospital with this email already exists", 409);
    }
    return ApiResponse.error(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!hospital) {
      return ApiResponse.error(res, "Hospital not found", 404);
    }

    return ApiResponse.success(res, hospital);
  } catch (error) {
    if (error.code === 11000) {
      return ApiResponse.error(res, "Hospital with this email already exists", 409);
    }
    return ApiResponse.error(res, error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return ApiResponse.error(res, "Hospital not found", 404);
    }

    const hospitalId = hospital._id;

    const departmentIds = (await Department.find({ hospitalId }).select("_id").lean()).map(
      (d) => d._id
    );

    await Promise.all([
      Doctor.deleteMany({ hospitalId }),
      Patient.deleteMany({ hospitalId }),
      Department.deleteMany({ hospitalId }),
      User.deleteMany({ hospitalId }),
    ]);

    await hospital.deleteOne();

    return ApiResponse.success(res, { message: "Hospital and all related data deleted" });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};
