import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import DashboardPage from "@/pages/DashboardPage";
import PatientsPage from "@/pages/patients/PatientsPage";
import NewPatientPage from "@/pages/patients/NewPatientPage";
import PatientDetailPage from "@/pages/patients/PatientDetailPage";
import DoctorsPage from "@/pages/doctors/DoctorsPage";
import DoctorDetailPage from "@/pages/doctors/DoctorDetailPage";
import AppointmentsPage from "@/pages/appointments/AppointmentsPage";
import NewAppointmentPage from "@/pages/appointments/NewAppointmentPage";
import DepartmentsPage from "@/pages/DepartmentsPage";
import MedicalRecordsPage from "@/pages/medical-records/MedicalRecordsPage";
import MedicalRecordDetailPage from "@/pages/medical-records/MedicalRecordDetailPage";
import PrescriptionsPage from "@/pages/prescriptions/PrescriptionsPage";
import PharmacyPage from "@/pages/pharmacy/PharmacyPage";
import LaboratoryPage from "@/pages/laboratory/LaboratoryPage";
import LabDetailPage from "@/pages/laboratory/LabDetailPage";
import BillingPage from "@/pages/billing/BillingPage";
import InvoiceDetailPage from "@/pages/billing/InvoiceDetailPage";
import NotificationsPage from "@/pages/notifications/NotificationsPage";
import SettingsPage from "@/pages/SettingsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 to-primary/5 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <span className="text-primary-foreground text-3xl">♥</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">MedCore HMS</h1>
          <p className="text-muted-foreground text-lg">
            Enterprise Hospital Management System for modern healthcare facilities.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg bg-background/60 p-4 backdrop-blur">
              <p className="text-2xl font-bold text-primary">500+</p>
              <p className="text-muted-foreground">Healthcare Professionals</p>
            </div>
            <div className="rounded-lg bg-background/60 p-4 backdrop-blur">
              <p className="text-2xl font-bold text-primary">50K+</p>
              <p className="text-muted-foreground">Patients Managed</p>
            </div>
            <div className="rounded-lg bg-background/60 p-4 backdrop-blur">
              <p className="text-2xl font-bold text-primary">99.9%</p>
              <p className="text-muted-foreground">System Uptime</p>
            </div>
            <div className="rounded-lg bg-background/60 p-4 backdrop-blur">
              <p className="text-2xl font-bold text-primary">24/7</p>
              <p className="text-muted-foreground">Support Available</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <AuthLayout>
              <ForgotPasswordPage />
            </AuthLayout>
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PatientsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients/new"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <NewPatientPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PatientDetailPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctors"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DoctorsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctors/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DoctorDetailPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AppointmentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments/new"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <NewAppointmentPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/departments"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DepartmentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/medical-records"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MedicalRecordsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/medical-records/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MedicalRecordDetailPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescriptions"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PrescriptionsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pharmacy"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PharmacyPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/laboratory"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <LaboratoryPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/laboratory/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <LabDetailPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <BillingPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <InvoiceDetailPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <NotificationsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
