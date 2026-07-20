export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  PATIENTS: "/patients",
  PATIENT_DETAIL: (id: string) => `/patients/${id}`,
  PATIENT_NEW: "/patients/new",
  DOCTORS: "/doctors",
  DOCTOR_DETAIL: (id: string) => `/doctors/${id}`,
  APPOINTMENTS: "/appointments",
  APPOINTMENT_NEW: "/appointments/new",
  DEPARTMENTS: "/departments",
  MEDICAL_RECORDS: "/medical-records",
  MEDICAL_RECORD_DETAIL: (id: string) => `/medical-records/${id}`,
  PRESCRIPTIONS: "/prescriptions",
  PHARMACY: "/pharmacy",
  LABORATORY: "/laboratory",
  LAB_DETAIL: (id: string) => `/laboratory/${id}`,
  BILLING: "/billing",
  BILLING_DETAIL: (id: string) => `/billing/${id}`,
  NOTIFICATIONS: "/notifications",
  SETTINGS: "/settings",
  ANALYTICS: "/analytics",
} as const;

export const ROLES = {
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  RECEPTIONIST: "RECEPTIONIST",
  PHARMACIST: "PHARMACIST",
  LAB_TECHNICIAN: "LAB_TECHNICIAN",
} as const;

export const APPOINTMENT_STATUSES = {
  SCHEDULED: { label: "Scheduled", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  CONFIRMED: { label: "Confirmed", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
  IN_PROGRESS: { label: "In Progress", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
  COMPLETED: { label: "Completed", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
  NO_SHOW: { label: "No Show", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
} as const;

export const INVOICE_STATUSES = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  PARTIAL: { label: "Partial", color: "bg-blue-100 text-blue-800" },
  PAID: { label: "Paid", color: "bg-green-100 text-green-800" },
  OVERDUE: { label: "Overdue", color: "bg-red-100 text-red-800" },
  CANCELLED: { label: "Cancelled", color: "bg-gray-100 text-gray-800" },
} as const;

export const LAB_ORDER_STATUSES = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-100 text-blue-800" },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Cancelled", color: "bg-gray-100 text-gray-800" },
} as const;

export const GENDER_OPTIONS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
];

export const BLOOD_GROUP_OPTIONS = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];

export const MEDICINE_CATEGORIES = [
  "Antibiotics",
  "Analgesics",
  "Antihistamines",
  "Cardiovascular",
  "Dermatological",
  "Gastrointestinal",
  "Hormonal",
  "Respiratory",
  "Vitamins & Supplements",
  "Other",
];

export const PAYMENT_METHODS = [
  { label: "Cash", value: "CASH" },
  { label: "Card", value: "CARD" },
  { label: "Bank Transfer", value: "BANK_TRANSFER" },
  { label: "Insurance", value: "INSURANCE" },
  { label: "Check", value: "CHECK" },
];
