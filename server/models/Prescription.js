const mongoose = require("mongoose");

const prescriptionItemSchema = new mongoose.Schema(
  {
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
    },
    medicineName: String,
    dosage: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    quantity: Number,
    instructions: String,
  },
  { _id: true }
);

const prescriptionSchema = new mongoose.Schema(
  {
    medicalRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalRecord",
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
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
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "CANCELLED", "EXPIRED"],
      default: "ACTIVE",
    },
    notes: String,
    validUntil: Date,
    items: [prescriptionItemSchema],
  },
  { timestamps: true }
);

prescriptionSchema.index({ patientId: 1 });
prescriptionSchema.index({ doctorId: 1 });
prescriptionSchema.index({ hospitalId: 1 });

module.exports = mongoose.model("Prescription", prescriptionSchema);
