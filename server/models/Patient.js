const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    mrn: {
      type: String,
      unique: true,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      required: [true, "Gender is required"],
    },
    bloodGroup: String,
    maritalStatus: {
      type: String,
      enum: ["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"],
    },
    allergies: String,
    medicalHistory: String,
    emergencyContact: String,
    emergencyPhone: String,
    insuranceProvider: String,
    insurancePolicyNo: String,
    address: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
  },
  { timestamps: true }
);

patientSchema.index({ hospitalId: 1 });
patientSchema.index({ gender: 1 });

module.exports = mongoose.model("Patient", patientSchema);
