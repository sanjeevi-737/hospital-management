const MedicalRecord = require("../models/MedicalRecord");
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
    if (req.query.recordType) filter.recordType = req.query.recordType;

    const [records, total] = await Promise.all([
      MedicalRecord.find(filter)
        .populate({
          path: "patientId",
          populate: { path: "userId", select: "firstName lastName email phone" },
        })
        .populate("doctorId", "firstName lastName")
        .populate("hospitalId", "name")
        .populate("appointmentId", "date startTime endTime status")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      MedicalRecord.countDocuments(filter),
    ]);

    return ApiResponse.paginated(res, records, total, page, limit);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate({
        path: "patientId",
        populate: { path: "userId", select: "firstName lastName email phone" },
      })
      .populate("doctorId", "firstName lastName")
      .populate("hospitalId", "name")
      .populate("appointmentId", "date startTime endTime status");

    if (!record) {
      return ApiResponse.error(res, "Medical record not found", 404);
    }

    return ApiResponse.success(res, record);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.create = async (req, res) => {
  try {
    const record = await MedicalRecord.create({
      ...req.body,
      doctorId: req.user._id,
    });

    return ApiResponse.success(res, record, 201);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return ApiResponse.error(res, "Medical record not found", 404);
    }

    if (
      req.user.role === "DOCTOR" &&
      record.doctorId.toString() !== req.user._id.toString()
    ) {
      return ApiResponse.error(
        res,
        "You can only update your own medical records",
        403
      );
    }

    const updated = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return ApiResponse.success(res, updated);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);

    if (!record) {
      return ApiResponse.error(res, "Medical record not found", 404);
    }

    return ApiResponse.success(res, { message: "Medical record deleted successfully" });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};
