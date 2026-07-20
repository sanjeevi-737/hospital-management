const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { protect } = require("../middleware/auth");
const authorize = require("../middleware/roles");

router.get("/", protect, appointmentController.getAll);
router.get("/doctor/:doctorId/availability", protect, appointmentController.getDoctorAvailability);
router.get("/:id", protect, appointmentController.getById);

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST", "DOCTOR"),
  appointmentController.create
);

router.patch(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST", "DOCTOR"),
  appointmentController.update
);

router.patch(
  "/:id/status",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST", "DOCTOR"),
  appointmentController.updateStatus
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN"),
  appointmentController.remove
);

module.exports = router;
