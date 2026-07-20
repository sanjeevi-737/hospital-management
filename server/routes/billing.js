const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");
const { protect } = require("../middleware/auth");
const authorize = require("../middleware/roles");

router.get(
  "/invoices",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT"),
  billingController.getAll
);
router.get(
  "/revenue-report",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT"),
  billingController.getRevenueReport
);
router.get(
  "/invoices/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT", "DOCTOR"),
  billingController.getById
);
router.post(
  "/invoices",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST", "ACCOUNTANT"),
  billingController.generateInvoice
);
router.post(
  "/invoices/:id/pay",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST", "ACCOUNTANT"),
  billingController.processPayment
);
router.delete(
  "/invoices/:id",
  protect,
  authorize("SUPER_ADMIN"),
  billingController.remove
);

module.exports = router;
