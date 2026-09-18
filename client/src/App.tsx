import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <DashboardPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/patients"
        element={
          <DashboardLayout>
            <PatientsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/patients/new"
        element={
          <DashboardLayout>
            <NewPatientPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/patients/:id"
        element={
          <DashboardLayout>
            <PatientDetailPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/doctors"
        element={
          <DashboardLayout>
            <DoctorsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/doctors/:id"
        element={
          <DashboardLayout>
            <DoctorDetailPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/appointments"
        element={
          <DashboardLayout>
            <AppointmentsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/appointments/new"
        element={
          <DashboardLayout>
            <NewAppointmentPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/departments"
        element={
          <DashboardLayout>
            <DepartmentsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/medical-records"
        element={
          <DashboardLayout>
            <MedicalRecordsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/medical-records/:id"
        element={
          <DashboardLayout>
            <MedicalRecordDetailPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/prescriptions"
        element={
          <DashboardLayout>
            <PrescriptionsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/pharmacy"
        element={
          <DashboardLayout>
            <PharmacyPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/laboratory"
        element={
          <DashboardLayout>
            <LaboratoryPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/laboratory/:id"
        element={
          <DashboardLayout>
            <LabDetailPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/billing"
        element={
          <DashboardLayout>
            <BillingPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/billing/:id"
        element={
          <DashboardLayout>
            <InvoiceDetailPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/notifications"
        element={
          <DashboardLayout>
            <NotificationsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <DashboardLayout>
            <SettingsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/analytics"
        element={
          <DashboardLayout>
            <AnalyticsPage />
          </DashboardLayout>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}