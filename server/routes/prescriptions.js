const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescriptionController");
const { protect } = require("../middleware/auth");
const authorize = require("../middleware/roles");

router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "PHARMACIST"),
  prescriptionController.getAll
);

router.get(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "PHARMACIST"),
  prescriptionController.getById
);

router.post(
  "/",
  protect,
  authorize("DOCTOR"),
  prescriptionController.create
);

router.patch(
  "/:id",
  protect,
  authorize("DOCTOR", "PHARMACIST"),
  prescriptionController.update
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN"),
  prescriptionController.remove
);

module.exports = router;
