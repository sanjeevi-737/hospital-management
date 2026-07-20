const Invoice = require("../models/Invoice");
const ApiResponse = require("../utils/apiResponse");

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.hospitalId) filter.hospitalId = req.query.hospitalId;
    if (req.query.patientId) filter.patientId = req.query.patientId;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

    const [invoices, total] = await Promise.all([
      Invoice.find(filter)
        .populate("patientId", "mrn")
        .populate({
          path: "patientId",
          populate: { path: "userId", select: "firstName lastName email phone" },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Invoice.countDocuments(filter),
    ]);

    return ApiResponse.paginated(res, invoices, total, page, limit);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("patientId", "mrn gender bloodGroup")
      .populate({
        path: "patientId",
        populate: { path: "userId", select: "firstName lastName email phone" },
      })
      .lean();

    if (!invoice) {
      return ApiResponse.error(res, "Invoice not found", 404);
    }

    return ApiResponse.success(res, invoice);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.generateInvoice = async (req, res) => {
  try {
    const { patientId, hospitalId, items, taxRate, discountAmount, dueDate, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return ApiResponse.error(res, "Items array is required", 400);
    }

    const year = new Date().getFullYear();
    const count = await Invoice.countDocuments({ hospitalId: hospitalId || req.user.hospitalId });
    const seq = String(count + 1).padStart(5, "0");
    const invoiceNumber = `INV-${year}-${seq}`;

    const subtotal = items.reduce((sum, item) => {
      item.total = item.quantity * item.unitPrice;
      return sum + item.total;
    }, 0);

    const rate = taxRate || 18;
    const taxAmount = parseFloat(((subtotal * rate) / 100).toFixed(2));
    const discount = discountAmount || 0;
    const totalAmount = parseFloat((subtotal + taxAmount - discount).toFixed(2));

    const invoice = await Invoice.create({
      invoiceNumber,
      patientId,
      hospitalId: hospitalId || req.user.hospitalId,
      items,
      subtotal,
      taxAmount,
      discountAmount: discount,
      totalAmount,
      dueDate,
      notes,
    });

    return ApiResponse.success(res, invoice, 201);
  } catch (error) {
    if (error.code === 11000) {
      return ApiResponse.error(res, "Invoice number generation conflict, please retry", 409);
    }
    return ApiResponse.error(res, error.message);
  }
};

exports.processPayment = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return ApiResponse.error(res, "Invoice not found", 404);
    }

    if (invoice.paymentStatus === "PAID") {
      return ApiResponse.error(res, "Invoice is already fully paid", 400);
    }

    if (invoice.paymentStatus === "CANCELLED" || invoice.paymentStatus === "REFUNDED") {
      return ApiResponse.error(res, `Cannot process payment for ${invoice.paymentStatus} invoice`, 400);
    }

    const { amount, paymentMethod, transactionId, notes } = req.body;

    if (!amount || amount <= 0) {
      return ApiResponse.error(res, "Valid payment amount is required", 400);
    }

    const totalPaid = invoice.payments.reduce((sum, p) => {
      if (p.status === "PAID") return sum + p.amount;
      return sum;
    }, 0);

    const remaining = parseFloat((invoice.totalAmount - totalPaid).toFixed(2));

    if (amount > remaining) {
      return ApiResponse.error(res, `Payment amount exceeds remaining balance of ${remaining}`, 400);
    }

    invoice.payments.push({
      amount,
      paymentMethod: paymentMethod || "CASH",
      transactionId,
      status: "PAID",
      notes,
      paidAt: new Date(),
    });

    const newTotalPaid = parseFloat((totalPaid + amount).toFixed(2));

    if (newTotalPaid >= invoice.totalAmount) {
      invoice.paymentStatus = "PAID";
    } else {
      invoice.paymentStatus = "PARTIAL";
    }

    await invoice.save();

    return ApiResponse.success(res, invoice);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate, hospitalId } = req.query;

    const filter = { paymentStatus: "PAID" };
    if (hospitalId) filter.hospitalId = hospitalId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const invoices = await Invoice.find(filter).lean();

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalTax = invoices.reduce((sum, inv) => sum + inv.taxAmount, 0);
    const totalDiscount = invoices.reduce((sum, inv) => sum + inv.discountAmount, 0);
    const invoiceCount = invoices.length;
    const averageInvoiceValue = invoiceCount > 0 ? parseFloat((totalRevenue / invoiceCount).toFixed(2)) : 0;

    const paymentMethodBreakdown = {};
    invoices.forEach((inv) => {
      inv.payments.forEach((p) => {
        if (p.status === "PAID") {
          if (!paymentMethodBreakdown[p.paymentMethod]) {
            paymentMethodBreakdown[p.paymentMethod] = { count: 0, total: 0 };
          }
          paymentMethodBreakdown[p.paymentMethod].count += 1;
          paymentMethodBreakdown[p.paymentMethod].total += p.amount;
        }
      });
    });

    return ApiResponse.success(res, {
      totalRevenue,
      totalTax,
      totalDiscount,
      invoiceCount,
      averageInvoiceValue,
      paymentMethodBreakdown,
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return ApiResponse.error(res, "Invoice not found", 404);
    }

    return ApiResponse.success(res, { message: "Invoice deleted" });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};
