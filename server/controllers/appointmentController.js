const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const ApiResponse = require("../utils/apiResponse");

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.hospitalId) filter.hospitalId = req.query.hospitalId;
    if (req.query.doctorId) filter.doctorId = req.query.doctorId;
    if (req.query.patientId) filter.patientId = req.query.patientId;
    if (req.query.status) filter.status = req.query.status;

    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate({
          path: "patientId",
          populate: { path: "userId", select: "firstName lastName email phone" },
        })
        .populate({
          path: "doctorId",
          populate: [
            { path: "userId", select: "firstName lastName email" },
            { path: "departmentId", select: "name" },
          ],
        })
        .populate("departmentId", "name")
        .sort({ date: -1, startTime: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Appointment.countDocuments(filter),
    ]);

    return ApiResponse.paginated(res, appointments, total, page, limit);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: "patientId",
        populate: { path: "userId", select: "firstName lastName email phone" },
      })
      .populate({
        path: "doctorId",
        populate: [
          { path: "userId", select: "firstName lastName email" },
          { path: "departmentId", select: "name" },
        ],
      })
      .populate("departmentId", "name")
      .populate("createdById", "firstName lastName");

    if (!appointment) {
      return ApiResponse.error(res, "Appointment not found", 404);
    }

    return ApiResponse.success(res, appointment);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.create = async (req, res) => {
  try {
    const { doctorId, patientId, date, startTime, endTime } = req.body;

    const [doctor, patient] = await Promise.all([
      Doctor.findById(doctorId),
      Patient.findById(patientId),
    ]);

    if (!doctor) {
      return ApiResponse.error(res, "Doctor not found", 404);
    }
    if (!patient) {
      return ApiResponse.error(res, "Patient not found", 404);
    }

    const appointmentDate = new Date(date);
    const overlapping = await Appointment.findOne({
      doctorId,
      date: appointmentDate,
      status: { $nin: ["CANCELLED", "NO_SHOW"] },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });

    if (overlapping) {
      return ApiResponse.error(
        res,
        "Doctor already has an appointment during this time slot",
        409
      );
    }

    const appointment = await Appointment.create({
      ...req.body,
      date: appointmentDate,
      createdById: req.user._id,
    });

    return ApiResponse.success(res, appointment, 201);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await Appointment.findById(req.params.id);
    if (!existing) {
      return ApiResponse.error(res, "Appointment not found", 404);
    }

    const dateChanged =
      req.body.date && req.body.date !== existing.date.toISOString();
    const timeChanged =
      (req.body.startTime && req.body.startTime !== existing.startTime) ||
      (req.body.endTime && req.body.endTime !== existing.endTime);

    if (dateChanged || timeChanged) {
      const checkDate = req.body.date
        ? new Date(req.body.date)
        : existing.date;
      const checkStart = req.body.startTime || existing.startTime;
      const checkEnd = req.body.endTime || existing.endTime;

      const overlapping = await Appointment.findOne({
        _id: { $ne: existing._id },
        doctorId: existing.doctorId,
        date: checkDate,
        status: { $nin: ["CANCELLED", "NO_SHOW"] },
        $or: [
          { startTime: { $lt: checkEnd }, endTime: { $gt: checkStart } },
        ],
      });

      if (overlapping) {
        return ApiResponse.error(
          res,
          "Doctor already has an appointment during this time slot",
          409
        );
      }
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return ApiResponse.success(res, appointment);
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

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return ApiResponse.error(res, "Appointment not found", 404);
    }

    return ApiResponse.success(res, appointment);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return ApiResponse.error(res, "Appointment not found", 404);
    }

    return ApiResponse.success(res, { message: "Appointment deleted successfully" });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const date = req.query.date
      ? new Date(req.query.date)
      : new Date();

    const doctor = await Doctor.findById(doctorId)
      .populate("userId", "firstName lastName")
      .populate("departmentId", "name");

    if (!doctor) {
      return ApiResponse.error(res, "Doctor not found", 404);
    }

    const bookedSlots = await Appointment.find({
      doctorId,
      date,
      status: { $nin: ["CANCELLED", "NO_SHOW"] },
    })
      .select("startTime endTime status")
      .lean();

    return ApiResponse.success(res, {
      doctorId: doctor._id,
      doctorName: doctor.userId
        ? `${doctor.userId.firstName} ${doctor.userId.lastName}`
        : null,
      specialization: doctor.specialization,
      department: doctor.departmentId?.name || null,
      date,
      availableDays: doctor.availableDays,
      availableFrom: doctor.availableFrom,
      availableTo: doctor.availableTo,
      bookedSlots,
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};
