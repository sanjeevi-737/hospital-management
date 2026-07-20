const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
    },
    qualification: String,
    experience: {
      type: Number,
      default: 0,
    },
    licenseNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    consultationFee: {
      type: Number,
      default: 0,
    },
    bio: String,
    availableDays: {
      type: String,
      default: "Mon,Tue,Wed,Thu,Fri",
    },
    availableFrom: {
      type: String,
      default: "09:00",
    },
    availableTo: {
      type: String,
      default: "17:00",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
  },
  { timestamps: true }
);

doctorSchema.index({ hospitalId: 1 });
doctorSchema.index({ departmentId: 1 });
doctorSchema.index({ specialization: 1 });

module.exports = mongoose.model("Doctor", doctorSchema);
