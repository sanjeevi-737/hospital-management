const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 1 },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: true }
);

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["CASH", "CREDIT_CARD", "DEBIT_CARD", "BANK_TRANSFER", "INSURANCE", "ONLINE"],
      default: "CASH",
    },
    transactionId: String,
    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PAID",
    },
    paidAt: { type: Date, default: Date.now },
    notes: String,
  },
  { _id: true, timestamps: { createdAt: true, updatedAt: false } }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
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
    subtotal: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PARTIAL", "PAID", "REFUNDED", "CANCELLED"],
      default: "PENDING",
    },
    dueDate: Date,
    notes: String,
    items: [invoiceItemSchema],
    payments: [paymentSchema],
  },
  { timestamps: true }
);

invoiceSchema.index({ patientId: 1 });
invoiceSchema.index({ hospitalId: 1 });
invoiceSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model("Invoice", invoiceSchema);
