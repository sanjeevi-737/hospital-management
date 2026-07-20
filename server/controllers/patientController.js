const Patient = require("../models/Patient");
const User = require("../models/User");
const ApiResponse = require("../utils/apiResponse");

const generateMRN = async () => {
  const lastPatient = await Patient.findOne().sort({ createdAt: -1 }).select("mrn").lean();

  let nextNumber = 1;
  if (lastPatient && lastPatient.mrn) {
    const lastNum = parseInt(lastPatient.mrn.replace("MRN-", ""), 10);
    if (!isNaN(lastNum)) {
      nextNumber = lastNum + 1;
    }
  }

  return `MRN-${String(nextNumber).padStart(5, "0")}`;
};

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
      const matchingUsers = await User.find({
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
        ],
      })
        .select("_id")
        .lean();

      const userIds = matchingUsers.map((u) => u._id);

      filter.$or = [
        { mrn: { $regex: search, $options: "i" } },
        { userId: { $in: userIds } },
      ];
    }

    const [patients, total] = await Promise.all([
      Patient.find(filter)
        .populate("userId", "firstName lastName email phone avatar")
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Patient.countDocuments(filter),
    ]);

    return ApiResponse.paginated(res, patients, total, page, limit);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate("userId", "firstName lastName email phone avatar")
      .lean();

    if (!patient) {
      return ApiResponse.error(res, "Patient not found", 404);
    }

    return ApiResponse.success(res, patient);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.create = async (req, res) => {
  try {
    const mrn = await generateMRN();

    const patient = await Patient.create({ ...req.body, mrn });
    return ApiResponse.success(res, patient, 201);
  } catch (error) {
    if (error.code === 11000) {
      return ApiResponse.error(res, "Patient profile already exists for this user", 409);
    }
    return ApiResponse.error(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!patient) {
      return ApiResponse.error(res, "Patient not found", 404);
    }

    return ApiResponse.success(res, patient);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return ApiResponse.error(res, "Patient not found", 404);
    }

    await patient.deleteOne();
    return ApiResponse.success(res, { message: "Patient deleted" });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};
