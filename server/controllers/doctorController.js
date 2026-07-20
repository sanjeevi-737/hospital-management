const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
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
    if (req.query.departmentId) {
      filter.departmentId = req.query.departmentId;
    }

    let doctorQuery = Doctor.find(filter)
      .populate("userId", "firstName lastName email phone avatar")
      .populate("departmentId", "name code")
      .sort({ [sortBy]: sortOrder });

    if (search) {
      const matchingUsers = await User.find({
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      })
        .select("_id")
        .lean();

      const userIds = matchingUsers.map((u) => u._id);
      filter.$or = [
        { specialization: { $regex: search, $options: "i" } },
        { userId: { $in: userIds } },
      ];

      doctorQuery = Doctor.find(filter)
        .populate("userId", "firstName lastName email phone avatar")
        .populate("departmentId", "name code")
        .sort({ [sortBy]: sortOrder });
    }

    const [doctors, total] = await Promise.all([
      doctorQuery.skip(skip).limit(limit).lean(),
      Doctor.countDocuments(filter),
    ]);

    return ApiResponse.paginated(res, doctors, total, page, limit);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("userId", "firstName lastName email phone avatar")
      .populate("departmentId", "name code")
      .lean();

    if (!doctor) {
      return ApiResponse.error(res, "Doctor not found", 404);
    }

    return ApiResponse.success(res, doctor);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.create = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);

    if (!user) {
      return ApiResponse.error(res, "User not found", 404);
    }

    if (user.role !== "DOCTOR") {
      return ApiResponse.error(res, "User must have DOCTOR role", 400);
    }

    const existing = await Doctor.findOne({ userId: req.body.userId });
    if (existing) {
      return ApiResponse.error(res, "Doctor profile already exists for this user", 409);
    }

    const doctor = await Doctor.create(req.body);
    return ApiResponse.success(res, doctor, 201);
  } catch (error) {
    if (error.code === 11000) {
      return ApiResponse.error(res, "Doctor with this license number already exists", 409);
    }
    return ApiResponse.error(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      return ApiResponse.error(res, "Doctor not found", 404);
    }

    return ApiResponse.success(res, doctor);
  } catch (error) {
    if (error.code === 11000) {
      return ApiResponse.error(res, "Doctor with this license number already exists", 409);
    }
    return ApiResponse.error(res, error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return ApiResponse.error(res, "Doctor not found", 404);
    }

    await doctor.deleteOne();
    return ApiResponse.success(res, { message: "Doctor deleted" });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).lean();

    if (!doctor) {
      return ApiResponse.error(res, "Doctor not found", 404);
    }

    const date = req.query.date;
    if (!date) {
      return ApiResponse.error(res, "Date query parameter is required", 400);
    }

    const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "short" });
    const availableDays = doctor.availableDays.split(",").map((d) => d.trim());

    if (!availableDays.includes(dayOfWeek)) {
      return ApiResponse.success(res, {
        doctorId: doctor._id,
        date,
        isAvailable: false,
        reason: "Doctor is not available on this day",
        bookedSlots: [],
      });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctorId: doctor._id,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ["SCHEDULED", "CONFIRMED", "IN_PROGRESS"] },
    })
      .select("startTime endTime status")
      .lean();

    return ApiResponse.success(res, {
      doctorId: doctor._id,
      date,
      isAvailable: true,
      availableFrom: doctor.availableFrom,
      availableTo: doctor.availableTo,
      bookedSlots: bookedAppointments.map((a) => ({
        startTime: a.startTime,
        endTime: a.endTime,
        status: a.status,
      })),
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};
