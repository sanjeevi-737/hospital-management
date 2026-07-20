const LabOrder = require("../models/LabOrder");
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
    if (req.query.hospitalId) filter.hospitalId = req.query.hospitalId;
    if (req.query.patientId) filter.patientId = req.query.patientId;
    if (req.query.status) filter.status = req.query.status;
    if (search) {
      filter.$or = [
        { testName: { $regex: search, $options: "i" } },
        { testType: { $regex: search, $options: "i" } },
      ];
    }

    const [orders, total] = await Promise.all([
      LabOrder.find(filter)
        .populate("patientId", "userId mrn gender bloodGroup")
        .populate({
          path: "patientId",
          populate: { path: "userId", select: "firstName lastName email phone" },
        })
        .populate("doctorId", "specialization")
        .populate({
          path: "doctorId",
          populate: { path: "userId", select: "firstName lastName" },
        })
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      LabOrder.countDocuments(filter),
    ]);

    return ApiResponse.paginated(res, orders, total, page, limit);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const order = await LabOrder.findById(req.params.id)
      .populate("patientId", "userId mrn gender bloodGroup")
      .populate({
        path: "patientId",
        populate: { path: "userId", select: "firstName lastName email phone" },
      })
      .populate("doctorId", "specialization")
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "firstName lastName" },
      })
      .populate("technicianId", "firstName lastName")
      .lean();

    if (!order) {
      return ApiResponse.error(res, "Lab order not found", 404);
    }

    return ApiResponse.success(res, order);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getByPatient = async (req, res) => {
  try {
    const orders = await LabOrder.find({ patientId: req.params.patientId })
      .populate("doctorId", "specialization")
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "firstName lastName" },
      })
      .sort({ createdAt: -1 })
      .lean();

    return ApiResponse.success(res, orders);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.create = async (req, res) => {
  try {
    req.body.doctorId = req.user._id;
    req.body.hospitalId = req.user.hospitalId;

    const order = await LabOrder.create(req.body);
    return ApiResponse.success(res, order, 201);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.addResult = async (req, res) => {
  try {
    const { results } = req.body;

    if (!results || !Array.isArray(results) || results.length === 0) {
      return ApiResponse.error(res, "Results array is required", 400);
    }

    const order = await LabOrder.findById(req.params.id);

    if (!order) {
      return ApiResponse.error(res, "Lab order not found", 404);
    }

    order.results.push(...results);
    order.status = "COMPLETED";
    order.completedDate = new Date();
    order.technicianId = req.user._id;

    await order.save();

    return ApiResponse.success(res, order);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return ApiResponse.error(res, "Status is required", 400);
    }

    const order = await LabOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return ApiResponse.error(res, "Lab order not found", 404);
    }

    return ApiResponse.success(res, order);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const order = await LabOrder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return ApiResponse.error(res, "Lab order not found", 404);
    }

    return ApiResponse.success(res, order);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const order = await LabOrder.findByIdAndDelete(req.params.id);

    if (!order) {
      return ApiResponse.error(res, "Lab order not found", 404);
    }

    return ApiResponse.success(res, { message: "Lab order deleted" });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};
