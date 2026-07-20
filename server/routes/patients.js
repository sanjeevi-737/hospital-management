const express = require("express");
const { z } = require("zod");
const router = express.Router();
const patientController = require("../controllers/patientController");
const { protect } = require("../middleware/auth");
const authorize = require("../middleware/roles");
const validate = require("../middleware/validate");

const createPatientSchema = z.object({
  body: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
    dateOfBirth: z.string().or(z.date()),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    bloodGroup: z.string().optional(),
    maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional(),
    allergies: z.string().optional(),
    medicalHistory: z.string().optional(),
    emergencyContact: z.string().optional(),
    emergencyPhone: z.string().optional(),
    insuranceProvider: z.string().optional(),
    insurancePolicyNo: z.string().optional(),
    address: z.string().optional(),
    isActive: z.boolean().optional(),
    hospitalId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid hospital ID"),
  }),
});

const updatePatientSchema = z.object({
  body: z.object({
    dateOfBirth: z.string().or(z.date()).optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    bloodGroup: z.string().optional(),
    maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional(),
    allergies: z.string().optional(),
    medicalHistory: z.string().optional(),
    emergencyContact: z.string().optional(),
    emergencyPhone: z.string().optional(),
    insuranceProvider: z.string().optional(),
    insurancePolicyNo: z.string().optional(),
    address: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid patient ID"),
  }),
});

router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"),
  patientController.getAll
);
router.get(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"),
  patientController.getById
);
router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST"),
  validate(createPatientSchema),
  patientController.create
);
router.patch(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "RECEPTIONIST"),
  validate(updatePatientSchema),
  patientController.update
);
router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN"),
  patientController.remove
);

module.exports = router;
