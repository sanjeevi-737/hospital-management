const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Department code is required"],
    },
    description: String,
    headOfDept: String,
    phone: String,
    email: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: [true, "Hospital ID is required"],
    },
  },
  { timestamps: true }
);

departmentSchema.index({ code: 1, hospitalId: 1 }, { unique: true });
departmentSchema.index({ hospitalId: 1 });

module.exports = mongoose.model("Department", departmentSchema);
