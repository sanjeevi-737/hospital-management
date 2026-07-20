const Medicine = require("../models/Medicine");
const ApiResponse = require("../utils/apiResponse");

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const filter = { isActive: true };
    if (req.query.hospitalId) filter.hospitalId = req.query.hospitalId;
    if (req.query.category) filter.category = req.query.category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { genericName: { $regex: search, $options: "i" } },
      ];
    }

    const [medicines, total] = await Promise.all([
      Medicine.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Medicine.countDocuments(filter),
    ]);

    return ApiResponse.paginated(res, medicines, total, page, limit);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).lean();

    if (!medicine) {
      return ApiResponse.error(res, "Medicine not found", 404);
    }

    return ApiResponse.success(res, medicine);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.create = async (req, res) => {
  try {
    if (!req.body.sku) {
      const count = await Medicine.countDocuments({
        hospitalId: req.body.hospitalId || req.user?.hospitalId,
      });
      const year = new Date().getFullYear();
      const seq = String(count + 1).padStart(5, "0");
      req.body.sku = `MED-${year}-${seq}`;
    }

    const medicine = await Medicine.create(req.body);
    return ApiResponse.success(res, medicine, 201);
  } catch (error) {
    if (error.code === 11000) {
      return ApiResponse.error(res, "A medicine with this SKU already exists", 409);
    }
    return ApiResponse.error(res, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!medicine) {
      return ApiResponse.error(res, "Medicine not found", 404);
    }

    return ApiResponse.success(res, medicine);
  } catch (error) {
    if (error.code === 11000) {
      return ApiResponse.error(res, "A medicine with this SKU already exists", 409);
    }
    return ApiResponse.error(res, error.message);
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { quantity, operation } = req.body;

    if (typeof quantity !== "number" || quantity <= 0) {
      return ApiResponse.error(res, "Quantity must be a positive number", 400);
    }
    if (!["add", "subtract"].includes(operation)) {
      return ApiResponse.error(res, "Operation must be 'add' or 'subtract'", 400);
    }

    const increment = operation === "add" ? quantity : -quantity;

    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { $inc: { quantity: increment } },
      { new: true, runValidators: true }
    );

    if (!medicine) {
      return ApiResponse.error(res, "Medicine not found", 404);
    }

    return ApiResponse.success(res, medicine);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!medicine) {
      return ApiResponse.error(res, "Medicine not found", 404);
    }

    return ApiResponse.success(res, { message: "Medicine deactivated" });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};
