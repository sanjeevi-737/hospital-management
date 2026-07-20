const express = require("express");
const router = express.Router();
const medicineController = require("../controllers/medicineController");
const { protect, optionalAuth } = require("../middleware/auth");
const authorize = require("../middleware/roles");

router.get("/", optionalAuth, medicineController.getAll);
router.get("/:id", optionalAuth, medicineController.getById);
router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST"),
  medicineController.create
);
router.patch(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST"),
  medicineController.update
);
router.patch(
  "/:id/stock",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST"),
  medicineController.updateStock
);
router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN"),
  medicineController.remove
);

module.exports = router;
