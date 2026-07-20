import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const patientSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], { required_error: "Gender is required" }),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insuranceId: z.string().optional(),
  allergies: z.string().optional(),
  medicalHistory: z.string().optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;

export const appointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  departmentId: z.string().optional(),
  appointmentDate: z.string().min(1, "Date is required"),
  appointmentTime: z.string().min(1, "Time is required"),
  type: z.enum(["WALK_IN", "SCHEDULED", "EMERGENCY", "FOLLOW_UP", "TELEHEALTH"], {
    required_error: "Appointment type is required",
  }),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

export const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  medicalRecordId: z.string().optional(),
  medications: z.array(
    z.object({
      name: z.string().min(1, "Medication name is required"),
      dosage: z.string().min(1, "Dosage is required"),
      frequency: z.string().min(1, "Frequency is required"),
      duration: z.string().min(1, "Duration is required"),
      notes: z.string().optional(),
    })
  ).min(1, "At least one medication is required"),
  instructions: z.string().optional(),
  duration: z.string().optional(),
});

export type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

export const medicineSchema = z.object({
  name: z.string().min(2, "Medicine name is required"),
  genericName: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  manufacturer: z.string().optional(),
  dosageForm: z.string().min(1, "Dosage form is required"),
  strength: z.string().min(1, "Strength is required"),
  unitPrice: z.number().min(0, "Price must be positive"),
  quantity: z.number().min(0, "Quantity must be positive"),
  minStockLevel: z.number().min(0, "Minimum stock level must be positive"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  batchNumber: z.string().optional(),
  description: z.string().optional(),
});

export type MedicineFormData = z.infer<typeof medicineSchema>;

export const labOrderSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  testType: z.string().min(1, "Test type is required"),
  testName: z.string().min(1, "Test name is required"),
  priority: z.enum(["ROUTINE", "URGENT", "STAT"], { required_error: "Priority is required" }),
  notes: z.string().optional(),
});

export type LabOrderFormData = z.infer<typeof labOrderSchema>;

export const labResultSchema = z.object({
  result: z.string().min(1, "Result is required"),
  notes: z.string().optional(),
});

export type LabResultFormData = z.infer<typeof labResultSchema>;

export const invoiceSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  appointmentId: z.string().optional(),
  items: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      unitPrice: z.number().min(0, "Price must be positive"),
      total: z.number(),
    })
  ).min(1, "At least one item is required"),
  tax: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  notes: z.string().optional(),
  dueDate: z.string().optional(),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

export const paymentSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  method: z.enum(["CASH", "CARD", "BANK_TRANSFER", "INSURANCE", "CHECK"], {
    required_error: "Payment method is required",
  }),
  reference: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
