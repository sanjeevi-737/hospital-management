const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["APPOINTMENT", "LAB_RESULT", "BILLING", "PRESCRIPTION", "SYSTEM", "REMINDER"],
      default: "SYSTEM",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    data: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ hospitalId: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
