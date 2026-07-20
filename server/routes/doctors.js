const express = require("express");
const { z } = require("zod");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const { protect, optionalAuth } = require("../middleware/auth");
const authorize = require("../middleware/roles");
const validate = require("../middleware/validate");

const createDoctorSchema = z.object({
  body: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
    specialization: z.string().min(1, "Specialization is required"),
    qualification: z.string().optional(),
    experience: z.number().min(0).optional(),
    licenseNumber: z.string().optional(),
    consultationFee: z.number().min(0).optional(),
    bio: z.string().optional(),
    availableDays: z.string().optional(),
    availableFrom: z.string().optional(),
    availableTo: z.string().optional(),
    isActive: z.boolean().optional(),
    hospitalId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid hospital ID"),
    departmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid department ID"),
  }),
});

const updateDoctorSchema = z.object({
  body: z.object({
    specialization: z.string().min(1).optional(),
    qualification: z.string().optional(),
    experience: z.number().min(0).optional(),
    licenseNumber: z.string().optional(),
    consultationFee: z.number().min(0).optional(),
    bio: z.string().optional(),
    availableDays: z.string().optional(),
    availableFrom: z.string().optional(),
    availableTo: z.string().optional(),
    isActive: z.boolean().optional(),
    hospitalId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    departmentId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid doctor ID"),
  }),
});

const availabilityParamsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid doctor ID"),
  }),
  query: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  }),
});

router.get("/", optionalAuth, doctorController.getAll);
router.get(
  "/:id/availability",
  validate(availabilityParamsSchema),
  doctorController.getAvailability
);
router.get("/:id", optionalAuth, doctorController.getById);
router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN"),
  validate(createDoctorSchema),
  doctorController.create
);
router.patch(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR"),
  validate(updateDoctorSchema),
  doctorController.update
);
router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN"),
  doctorController.remove
);

module.exports = router;
