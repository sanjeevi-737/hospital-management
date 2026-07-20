import React from "react";
import { Link } from "react-router-dom";
import { Plus, CalendarDays, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentTable } from "@/components/appointments/appointment-table";
import { AppointmentCalendar } from "@/components/appointments/appointment-calendar";
import type { Appointment } from "@/types";

const mockAppointments: Appointment[] = [
  { id: "1", patientId: "p1", patient: { id: "p1", mrn: "MRN-001", firstName: "John", lastName: "Doe", email: "john@test.com", phone: "555-0101", dateOfBirth: "1990-01-01", gender: "MALE", createdAt: "", updatedAt: "" }, doctorId: "d1", doctor: { id: "d1", userId: "u1", user: { id: "u1", email: "dr@test.com", firstName: "Sarah", lastName: "Smith", role: "DOCTOR", createdAt: "", updatedAt: "" }, specialization: "Cardiology", licenseNumber: "LIC-001", departmentId: "dep1", createdAt: "", updatedAt: "" }, appointmentDate: "2025-01-20", appointmentTime: "09:00", status: "CONFIRMED", type: "SCHEDULED", reason: "Routine checkup", createdAt: "", updatedAt: "" },
  { id: "2", patientId: "p2", patient: { id: "p2", mrn: "MRN-002", firstName: "Jane", lastName: "Wilson", email: "jane@test.com", phone: "555-0102", dateOfBirth: "1985-05-15", gender: "FEMALE", createdAt: "", updatedAt: "" }, doctorId: "d2", doctor: { id: "d2", userId: "u2", user: { id: "u2", email: "dr2@test.com", firstName: "Mike", lastName: "Johnson", role: "DOCTOR", createdAt: "", updatedAt: "" }, specialization: "Neurology", licenseNumber: "LIC-002", departmentId: "dep2", createdAt: "", updatedAt: "" }, appointmentDate: "2025-01-20", appointmentTime: "10:30", status: "SCHEDULED", type: "FOLLOW_UP", createdAt: "", updatedAt: "" },
  { id: "3", patientId: "p3", patient: { id: "p3", mrn: "MRN-003", firstName: "Robert", lastName: "Brown", email: "robert@test.com", phone: "555-0103", dateOfBirth: "1978-11-20", gender: "MALE", createdAt: "", updatedAt: "" }, doctorId: "d1", doctor: { id: "d1", userId: "u1", user: { id: "u1", email: "dr@test.com", firstName: "Sarah", lastName: "Smith", role: "DOCTOR", createdAt: "", updatedAt: "" }, specialization: "Cardiology", licenseNumber: "LIC-001", departmentId: "dep1", createdAt: "", updatedAt: "" }, appointmentDate: "2025-01-20", appointmentTime: "11:00", status: "COMPLETED", type: "WALK_IN", createdAt: "", updatedAt: "" },
  { id: "4", patientId: "p4", patient: { id: "p4", mrn: "MRN-004", firstName: "Emily", lastName: "Davis", email: "emily@test.com", phone: "555-0104", dateOfBirth: "1995-03-08", gender: "FEMALE", createdAt: "", updatedAt: "" }, doctorId: "d3", doctor: { id: "d3", userId: "u3", user: { id: "u3", email: "dr3@test.com", firstName: "Emily", lastName: "Chen", role: "DOCTOR", createdAt: "", updatedAt: "" }, specialization: "Pediatrics", licenseNumber: "LIC-003", departmentId: "dep3", createdAt: "", updatedAt: "" }, appointmentDate: "2025-01-21", appointmentTime: "14:00", status: "SCHEDULED", type: "EMERGENCY", createdAt: "", updatedAt: "" },
];

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Appointments" description="Manage patient appointments">
        <Link to="/appointments/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </Link>
      </PageHeader>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list" className="gap-1">
            <List className="h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-1">
            <CalendarDays className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <AppointmentTable data={mockAppointments} />
        </TabsContent>
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <AppointmentCalendar />
            </div>
            <div>
              <div className="space-y-4">
                <h3 className="font-semibold">Today&apos;s Schedule</h3>
                {mockAppointments.filter(a => a.status !== "COMPLETED").map((apt) => (
                  <div key={apt.id} className="rounded-lg border p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{apt.patient?.firstName} {apt.patient?.lastName}</p>
                        <p className="text-xs text-muted-foreground">Dr. {apt.doctor?.user?.firstName} {apt.doctor?.user?.lastName}</p>
                      </div>
                      <span className="text-xs font-medium">{apt.appointmentTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
