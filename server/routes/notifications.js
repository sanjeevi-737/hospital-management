const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");

router.get("/", protect, notificationController.getAll);
router.get("/unread-count", protect, notificationController.getUnreadCount);
router.get("/:id", protect, notificationController.getById);
router.patch("/:id/read", protect, notificationController.markAsRead);
router.patch("/read-all", protect, notificationController.markAllAsRead);
router.delete("/:id", protect, notificationController.remove);

module.exports = router;
