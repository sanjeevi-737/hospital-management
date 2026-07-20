const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    recordType: {
      type: String,
      enum: ["CONSULTATION", "FOLLOW_UP", "EMERGENCY", "SURGERY", "GENERAL"],
      default: "GENERAL",
    },
    chiefComplaint: String,
    diagnosis: {
      type: String,
      required: [true, "Diagnosis is required"],
    },
    symptoms: String,
    treatment: String,
    vitals: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    notes: String,
    attachments: [String],
  },
  { timestamps: true }
);

medicalRecordSchema.index({ patientId: 1 });
medicalRecordSchema.index({ doctorId: 1 });
medicalRecordSchema.index({ hospitalId: 1 });

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
