const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
    },
    genericName: String,
    category: {
      type: String,
      enum: [
        "TABLET",
        "CAPSULE",
        "SYRUP",
        "INJECTION",
        "OINTMENT",
        "DROPS",
        "INHALER",
        "ANALGESIC",
        "ANTIBIOTIC",
        "CARDIOVASCULAR",
        "OTHER",
      ],
      default: "OTHER",
    },
    manufacturer: String,
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    unitPrice: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    unit: {
      type: String,
      default: "tablet",
    },
    minStockLevel: {
      type: Number,
      default: 10,
    },
    expiryDate: Date,
    batchNumber: String,
    description: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },
  },
  { timestamps: true }
);

medicineSchema.index({ hospitalId: 1 });
medicineSchema.index({ name: "text", genericName: "text" });
medicineSchema.index({ category: 1 });

module.exports = mongoose.model("Medicine", medicineSchema);
