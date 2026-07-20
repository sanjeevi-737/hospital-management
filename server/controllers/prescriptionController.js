const Prescription = require("../models/Prescription");
const ApiResponse = require("../utils/apiResponse");

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.patientId) filter.patientId = req.query.patientId;
    if (req.query.doctorId) filter.doctorId = req.query.doctorId;
    if (req.query.hospitalId) filter.hospitalId = req.query.hospitalId;
    if (req.query.status) filter.status = req.query.status;

    const [prescriptions, total] = await Promise.all([
      Prescription.find(filter)
        .populate({
          path: "patientId",
          populate: { path: "userId", select: "firstName lastName email phone" },
        })
        .populate({
          path: "doctorId",
          populate: { path: "userId", select: "firstName lastName" },
        })
        .populate("hospitalId", "name")
        .populate("medicalRecordId", "diagnosis recordType")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Prescription.countDocuments(filter),
    ]);

    return ApiResponse.paginated(res, prescriptions, total, page, limit);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate({
        path: "patientId",
        populate: { path: "userId", select: "firstName lastName email phone" },
      })
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "firstName lastName" },
      })
      .populate("hospitalId", "name")
      .populate("medicalRecordId", "diagnosis recordType")
      .populate("items.medicineId", "name genericName category");

    if (!prescription) {
      return ApiResponse.error(res, "Prescription not found", 404);
    }

    return ApiResponse.success(res, prescription);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.create = async (req, res) => {
  try {
    const prescription = await Prescription.create(req.body);
    return ApiResponse.success(res, prescription, 201);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!prescription) {
      return ApiResponse.error(res, "Prescription not found", 404);
    }

    return ApiResponse.success(res, prescription);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);

    if (!prescription) {
      return ApiResponse.error(res, "Prescription not found", 404);
    }

    return ApiResponse.success(res, { message: "Prescription deleted successfully" });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};
