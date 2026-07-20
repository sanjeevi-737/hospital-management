const express = require("express");
const router = express.Router();
const medicalRecordController = require("../controllers/medicalRecordController");
const { protect } = require("../middleware/auth");
const authorize = require("../middleware/roles");

router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"),
  medicalRecordController.getAll
);

router.get(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"),
  medicalRecordController.getById
);

router.post(
  "/",
  protect,
  authorize("DOCTOR"),
  medicalRecordController.create
);

router.patch(
  "/:id",
  protect,
  authorize("DOCTOR"),
  medicalRecordController.update
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN"),
  medicalRecordController.remove
);

module.exports = router;
