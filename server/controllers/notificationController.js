const Notification = require("../models/Notification");
const ApiResponse = require("../utils/apiResponse");

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { userId: req.user._id };
    if (req.query.isRead !== undefined) filter.isRead = req.query.isRead === "true";
    if (req.query.type) filter.type = req.query.type;

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(filter),
    ]);

    return ApiResponse.paginated(res, notifications, total, page, limit);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).lean();

    if (!notification) {
      return ApiResponse.error(res, "Notification not found", 404);
    }

    return ApiResponse.success(res, notification);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return ApiResponse.error(res, "Notification not found", 404);
    }

    return ApiResponse.success(res, notification);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    return ApiResponse.success(res, { message: "All notifications marked as read" });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return ApiResponse.error(res, "Notification not found", 404);
    }

    return ApiResponse.success(res, { message: "Notification deleted" });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false,
    });

    return ApiResponse.success(res, { count });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};
