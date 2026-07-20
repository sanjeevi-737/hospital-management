const express = require("express");
const { z } = require("zod");
const router = express.Router();
const hospitalController = require("../controllers/hospitalController");
const { protect, optionalAuth } = require("../middleware/auth");
const authorize = require("../middleware/roles");
const validate = require("../middleware/validate");

const createHospitalSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Hospital name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(1, "Phone is required"),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
    logo: z.string().url().optional().or(z.literal("")),
    website: z.string().url().optional().or(z.literal("")),
    licenseNo: z.string().optional(),
    timezone: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateHospitalSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(1).optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
    logo: z.string().url().optional().or(z.literal("")),
    website: z.string().url().optional().or(z.literal("")),
    licenseNo: z.string().optional(),
    timezone: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid hospital ID"),
  }),
});

router.get("/", optionalAuth, hospitalController.getAll);
router.get("/:id", optionalAuth, hospitalController.getById);
router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN"),
  validate(createHospitalSchema),
  hospitalController.create
);
router.patch(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN"),
  validate(updateHospitalSchema),
  hospitalController.update
);
router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  hospitalController.remove
);

module.exports = router;
