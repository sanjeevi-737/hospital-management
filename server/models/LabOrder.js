const mongoose = require("mongoose");

const labResultSchema = new mongoose.Schema(
  {
    parameter: { type: String, required: true },
    value: { type: String, required: true },
    unit: String,
    normalRange: String,
    isAbnormal: { type: Boolean, default: false },
    notes: String,
  },
  { _id: true, timestamps: { createdAt: true, updatedAt: false } }
);

const labOrderSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    testName: {
      type: String,
      required: [true, "Test name is required"],
    },
    testType: String,
    instructions: String,
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
    priority: {
      type: String,
      enum: ["ROUTINE", "URGENT", "STAT"],
      default: "ROUTINE",
    },
    clinicalNotes: String,
    results: [labResultSchema],
    orderedDate: {
      type: Date,
      default: Date.now,
    },
    completedDate: Date,
  },
  { timestamps: true }
);

labOrderSchema.index({ patientId: 1 });
labOrderSchema.index({ hospitalId: 1 });
labOrderSchema.index({ status: 1 });

module.exports = mongoose.model("LabOrder", labOrderSchema);
