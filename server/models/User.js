const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    phone: String,
    avatar: String,
    role: {
      type: String,
      enum: [
        "SUPER_ADMIN",
        "HOSPITAL_ADMIN",
        "DOCTOR",
        "NURSE",
        "PHARMACIST",
        "LAB_TECHNICIAN",
        "RECEPTIONIST",
        "PATIENT",
        "ACCOUNTANT",
      ],
      default: "PATIENT",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: Date,
    refreshToken: {
      type: String,
      select: false,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: [true, "Hospital ID is required"],
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1, hospitalId: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ hospitalId: 1 });

module.exports = mongoose.model("User", userSchema);
