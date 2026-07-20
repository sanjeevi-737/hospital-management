const express = require("express");
const { z } = require("zod");
const router = express.Router();
const departmentController = require("../controllers/departmentController");
const { protect, optionalAuth } = require("../middleware/auth");
const authorize = require("../middleware/roles");
const validate = require("../middleware/validate");

const createDepartmentSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Department name is required"),
    code: z.string().min(1, "Department code is required"),
    description: z.string().optional(),
    headOfDept: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    isActive: z.boolean().optional(),
    hospitalId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid hospital ID"),
  }),
});

const updateDepartmentSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    code: z.string().min(1).optional(),
    description: z.string().optional(),
    headOfDept: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    isActive: z.boolean().optional(),
    hospitalId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid department ID"),
  }),
});

router.get("/", optionalAuth, departmentController.getAll);
router.get("/:id", optionalAuth, departmentController.getById);
router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN"),
  validate(createDepartmentSchema),
  departmentController.create
);
router.patch(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN"),
  validate(updateDepartmentSchema),
  departmentController.update
);
router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HOSPITAL_ADMIN"),
  departmentController.remove
);

module.exports = router;
