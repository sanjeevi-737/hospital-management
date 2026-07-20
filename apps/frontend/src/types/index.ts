export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "PHARMACIST" | "LAB_TECHNICIAN";

export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup?: BloodGroup;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  insuranceProvider?: string;
  insuranceId?: string;
  allergies?: string;
  medicalHistory?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface Doctor {
  id: string;
  userId: string;
  user: User;
  specialization: string;
  licenseNumber: string;
  departmentId: string;
  department?: Department;
  qualification?: string;
  experience?: number;
  consultationFee?: number;
  availableDays?: string[];
  availableFrom?: string;
  availableTo?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  headDoctorId?: string;
  headDoctor?: Doctor;
  location?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patient?: Patient;
  doctorId: string;
  doctor?: Doctor;
  departmentId?: string;
  department?: Department;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  type: AppointmentType;
  reason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = "SCHEDULED" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export type AppointmentType = "WALK_IN" | "SCHEDULED" | "EMERGENCY" | "FOLLOW_UP" | "TELEHEALTH";

export interface MedicalRecord {
  id: string;
  patientId: string;
  patient?: Patient;
  doctorId: string;
  doctor?: Doctor;
  appointmentId?: string;
  appointment?: Appointment;
  diagnosis: string;
  symptoms?: string;
  treatment?: string;
  notes?: string;
  vitals?: Vitals;
  createdAt: string;
  updatedAt: string;
}

export interface Vitals {
  temperature?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
}

export interface Prescription {
  id: string;
  patientId: string;
  patient?: Patient;
  doctorId: string;
  doctor?: Doctor;
  medicalRecordId?: string;
  medicalRecord?: MedicalRecord;
  medications: Medication[];
  instructions?: string;
  duration?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  category: string;
  manufacturer?: string;
  dosageForm: string;
  strength: string;
  unitPrice: number;
  quantity: number;
  minStockLevel: number;
  expiryDate: string;
  batchNumber?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabOrder {
  id: string;
  patientId: string;
  patient?: Patient;
  doctorId: string;
  doctor?: Doctor;
  testType: string;
  testName: string;
  status: LabOrderStatus;
  priority: LabPriority;
  result?: string;
  resultFile?: string;
  notes?: string;
  orderDate: string;
  resultDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type LabOrderStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type LabPriority = "ROUTINE" | "URGENT" | "STAT";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patient?: Patient;
  appointmentId?: string;
  appointment?: Appointment;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: InvoiceStatus;
  paidAt?: string;
  dueDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type InvoiceStatus = "PENDING" | "PARTIAL" | "PAID" | "OVERDUE" | "CANCELLED";

export interface Payment {
  id: string;
  invoiceId: string;
  invoice?: Invoice;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  paidAt: string;
  createdAt: string;
}

export type PaymentMethod = "CASH" | "CARD" | "BANK_TRANSFER" | "INSURANCE" | "CHECK";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  createdAt: string;
}

export type NotificationType = "INFO" | "WARNING" | "SUCCESS" | "ERROR" | "APPOINTMENT" | "LAB_RESULT" | "BILLING";
