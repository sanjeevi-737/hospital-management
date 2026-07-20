const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    address: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: "India",
    },
    zipCode: String,
    logo: String,
    website: String,
    licenseNo: String,
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

hospitalSchema.index({ name: "text", city: "text" });

module.exports = mongoose.model("Hospital", hospitalSchema);
