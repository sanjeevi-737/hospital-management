require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");

const Hospital = require("../models/Hospital");
const User = require("../models/User");
const Department = require("../models/Department");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Medicine = require("../models/Medicine");

const seed = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Notification.deleteMany();
  await AuditLog.deleteMany();
  await Invoice.deleteMany();
  await LabOrder.deleteMany();
  await Prescription.deleteMany();
  await MedicalRecord.deleteMany();
  await Appointment.deleteMany();
  await Patient.deleteMany();
  await Doctor.deleteMany();
  await Department.deleteMany();
  await Medicine.deleteMany();
  await User.deleteMany();
  await Hospital.deleteMany();

  const password = await bcrypt.hash("MedCore@123", 12);

  // Hospital
  const hospital = await Hospital.create({
    name: "MedCore City Hospital",
    slug: "medcore-city-hospital",
    email: "admin@medcorehospital.com",
    phone: "+91-22-12345678",
    address: "123 Medical District",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    website: "https://medcorehospital.com",
    timezone: "Asia/Kolkata",
  });

  // Users
  const superAdmin = await User.create({
    email: "superadmin@medcore.com",
    password,
    firstName: "Super",
    lastName: "Admin",
    phone: "+91-9876543210",
    role: "SUPER_ADMIN",
    hospitalId: hospital._id,
  });

  const hospitalAdmin = await User.create({
    email: "hospitaladmin@medcore.com",
    password,
    firstName: "Hospital",
    lastName: "Admin",
    phone: "+91-9876543211",
    role: "HOSPITAL_ADMIN",
    hospitalId: hospital._id,
  });

  // Departments
  const departments = await Department.insertMany([
    { name: "Cardiology", code: "CARD", description: "Heart and cardiovascular system care", hospitalId: hospital._id },
    { name: "Neurology", code: "NEURO", description: "Brain and nervous system care", hospitalId: hospital._id },
    { name: "Orthopedics", code: "ORTHO", description: "Bone and joint care", hospitalId: hospital._id },
    { name: "General Medicine", code: "GEN", description: "General healthcare and internal medicine", hospitalId: hospital._id },
  ]);

  // Doctor Users
  const doctorUsers = await User.insertMany([
    { email: "dr.priya@medcore.com", password, firstName: "Priya", lastName: "Sharma", phone: "+91-9876543220", role: "DOCTOR", hospitalId: hospital._id },
    { email: "dr.rajesh@medcore.com", password, firstName: "Rajesh", lastName: "Patel", phone: "+91-9876543221", role: "DOCTOR", hospitalId: hospital._id },
    { email: "dr.amit@medcore.com", password, firstName: "Amit", lastName: "Kumar", phone: "+91-9876543222", role: "DOCTOR", hospitalId: hospital._id },
  ]);

  // Doctor Profiles
  const doctors = await Doctor.insertMany([
    {
      userId: doctorUsers[0]._id,
      specialization: "Interventional Cardiology",
      qualification: "MBBS, MD Cardiology, DM Interventional Cardiology",
      experience: 12,
      licenseNumber: "MCI-2015-1234",
      consultationFee: 1500,
      hospitalId: hospital._id,
      departmentId: departments[0]._id,
      availableDays: "Mon,Tue,Wed,Thu,Fri",
    },
    {
      userId: doctorUsers[1]._id,
      specialization: "Neurosurgery",
      qualification: "MBBS, MS Neurosurgery, Fellowship in Spine Surgery",
      experience: 15,
      licenseNumber: "MCI-2016-5678",
      consultationFee: 2000,
      hospitalId: hospital._id,
      departmentId: departments[1]._id,
      availableDays: "Mon,Wed,Fri",
    },
    {
      userId: doctorUsers[2]._id,
      specialization: "Joint Replacement",
      qualification: "MBBS, MS Orthopedics, Fellowship in Joint Replacement",
      experience: 10,
      licenseNumber: "MCI-2017-9012",
      consultationFee: 1200,
      hospitalId: hospital._id,
      departmentId: departments[2]._id,
      availableDays: "Tue,Thu,Sat",
    },
  ]);

  // Patient Users
  const patientUsers = await User.insertMany([
    { email: "rahul.gupta@email.com", password, firstName: "Rahul", lastName: "Gupta", phone: "+91-9876543230", role: "PATIENT", hospitalId: hospital._id },
    { email: "sneha.verma@email.com", password, firstName: "Sneha", lastName: "Verma", phone: "+91-9876543231", role: "PATIENT", hospitalId: hospital._id },
    { email: "arjun.singh@email.com", password, firstName: "Arjun", lastName: "Singh", phone: "+91-9876543232", role: "PATIENT", hospitalId: hospital._id },
    { email: "priyanka.joshi@email.com", password, firstName: "Priyanka", lastName: "Joshi", phone: "+91-9876543233", role: "PATIENT", hospitalId: hospital._id },
    { email: "vikram.mehta@email.com", password, firstName: "Vikram", lastName: "Mehta", phone: "+91-9876543234", role: "PATIENT", hospitalId: hospital._id },
  ]);

  // Patient Profiles
  const patients = await Patient.insertMany([
    { userId: patientUsers[0]._id, mrn: "MRN-00001", dateOfBirth: new Date("1985-06-15"), gender: "MALE", bloodGroup: "B+", allergies: "Penicillin", hospitalId: hospital._id, address: "45 Andheri West, Mumbai" },
    { userId: patientUsers[1]._id, mrn: "MRN-00002", dateOfBirth: new Date("1990-03-22"), gender: "FEMALE", bloodGroup: "A+", hospitalId: hospital._id, address: "78 Bandra East, Mumbai" },
    { userId: patientUsers[2]._id, mrn: "MRN-00003", dateOfBirth: new Date("1978-11-08"), gender: "MALE", bloodGroup: "O+", allergies: "Aspirin", hospitalId: hospital._id, address: "12 Powai, Mumbai" },
    { userId: patientUsers[3]._id, mrn: "MRN-00004", dateOfBirth: new Date("1995-08-17"), gender: "FEMALE", bloodGroup: "AB+", hospitalId: hospital._id, address: "90 Juhu, Mumbai" },
    { userId: patientUsers[4]._id, mrn: "MRN-00005", dateOfBirth: new Date("1982-12-03"), gender: "MALE", bloodGroup: "A-", hospitalId: hospital._id, address: "34 Dadar, Mumbai" },
  ]);

  // Support Staff
  await User.insertMany([
    { email: "pharmacist1@medcore.com", password, firstName: "Rakesh", lastName: "Pharma", phone: "+91-9876543250", role: "PHARMACIST", hospitalId: hospital._id },
    { email: "nurse1@medcore.com", password, firstName: "Kavita", lastName: "Nurse", phone: "+91-9876543254", role: "NURSE", hospitalId: hospital._id },
    { email: "labtech1@medcore.com", password, firstName: "Suresh", lastName: "Lab", phone: "+91-9876543252", role: "LAB_TECHNICIAN", hospitalId: hospital._id },
    { email: "receptionist1@medcore.com", password, firstName: "Anita", lastName: "Reception", phone: "+91-9876543260", role: "RECEPTIONIST", hospitalId: hospital._id },
  ]);

  // Appointments
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  await Appointment.insertMany([
    { patientId: patients[0]._id, doctorId: doctors[0]._id, hospitalId: hospital._id, departmentId: departments[0]._id, date: tomorrow, startTime: "10:00", endTime: "10:30", status: "SCHEDULED", reason: "Chest pain evaluation" },
    { patientId: patients[1]._id, doctorId: doctors[1]._id, hospitalId: hospital._id, departmentId: departments[1]._id, date: tomorrow, startTime: "11:00", endTime: "11:30", status: "CONFIRMED", reason: "Persistent headaches" },
    { patientId: patients[2]._id, doctorId: doctors[2]._id, hospitalId: hospital._id, departmentId: departments[2]._id, date: nextWeek, startTime: "09:00", endTime: "09:30", status: "SCHEDULED", reason: "Knee pain consultation" },
  ]);

  // Medicines
  await Medicine.insertMany([
    { name: "Metformin 500mg", genericName: "Metformin Hydrochloride", category: "TABLET", manufacturer: "Sun Pharma", unitPrice: 45.5, quantity: 500, unit: "tablet", hospitalId: hospital._id },
    { name: "Amoxicillin 500mg", genericName: "Amoxicillin", category: "CAPSULE", manufacturer: "Cipla", unitPrice: 85, quantity: 300, unit: "capsule", hospitalId: hospital._id },
    { name: "Atorvastatin 10mg", genericName: "Atorvastatin Calcium", category: "CARDIOVASCULAR", manufacturer: "Dr. Reddy's", unitPrice: 120, quantity: 250, unit: "tablet", hospitalId: hospital._id },
    { name: "Omeprazole 20mg", genericName: "Omeprazole", category: "CAPSULE", manufacturer: "AstraZeneca", unitPrice: 95, quantity: 400, unit: "capsule", hospitalId: hospital._id },
    { name: "Paracetamol 500mg", genericName: "Acetaminophen", category: "TABLET", manufacturer: "GSK", unitPrice: 25, quantity: 1000, unit: "tablet", hospitalId: hospital._id },
  ]);

  console.log("\nDatabase seeded successfully!");
  console.log("\nLogin credentials:");
  console.log("  Super Admin: superadmin@medcore.com / MedCore@123");
  console.log("  Hospital Admin: hospitaladmin@medcore.com / MedCore@123");
  console.log("  Doctor: dr.priya@medcore.com / MedCore@123");
  console.log("  Patient: rahul.gupta@email.com / MedCore@123");

  process.exit(0);
};

const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");
const Invoice = require("../models/Invoice");
const LabOrder = require("../models/LabOrder");
const Prescription = require("../models/Prescription");
const MedicalRecord = require("../models/MedicalRecord");

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
