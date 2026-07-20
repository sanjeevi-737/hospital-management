const express = require("express");
const router = express.Router();
const labController = require("../controllers/labController");
const { protect } = require("../middleware/auth");
const authorize = require("../middleware/roles");

router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "LAB_TECHNICIAN"),
  labController.getAll
);
router.get(
  "/patient/:patientId",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "LAB_TECHNICIAN"),
  labController.getByPatient
);
router.get(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "LAB_TECHNICIAN"),
  labController.getById
);
router.post("/", protect, authorize("DOCTOR"), labController.create);
router.patch(
  "/:id/result",
  protect,
  authorize("LAB_TECHNICIAN"),
  labController.addResult
);
router.patch(
  "/:id/status",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN"),
  labController.updateStatus
);
router.patch(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN"),
  labController.update
);
router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN"),
  labController.remove
);

module.exports = router;
