import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    this.logger.log('Starting database seed...');

    await this.prisma.notification.deleteMany();
    await this.prisma.auditLog.deleteMany();
    await this.prisma.invoiceItem.deleteMany();
    await this.prisma.invoice.deleteMany();
    await this.prisma.labOrder.deleteMany();
    await this.prisma.prescriptionMedication.deleteMany();
    await this.prisma.prescription.deleteMany();
    await this.prisma.medicalRecord.deleteMany();
    await this.prisma.appointment.deleteMany();
    await this.prisma.patient.deleteMany();
    await this.prisma.doctor.deleteMany();
    await this.prisma.department.deleteMany();
    await this.prisma.medicine.deleteMany();
    await this.prisma.user.deleteMany();
    await this.prisma.hospital.deleteMany();

    const password = await bcrypt.hash('MedCore@123', 12);

    const hospital = await this.prisma.hospital.create({
      data: {
        name: 'MedCore City Hospital',
        address: '123 Medical District',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        phone: '+91-22-12345678',
        email: 'admin@medcorehospital.com',
        website: 'https://medcorehospital.com',
      },
    });

    const superAdmin = await this.prisma.user.create({
      data: {
        email: 'superadmin@medcore.com',
        password,
        firstName: 'Super',
        lastName: 'Admin',
        phone: '+91-9876543210',
        role: 'SUPER_ADMIN',
        hospitalId: hospital.id,
      },
    });

    const hospitalAdmin = await this.prisma.user.create({
      data: {
        email: 'hospitaladmin@medcore.com',
        password,
        firstName: 'Hospital',
        lastName: 'Admin',
        phone: '+91-9876543211',
        role: 'HOSPITAL_ADMIN',
        hospitalId: hospital.id,
      },
    });

    const departments = await Promise.all([
      this.prisma.department.create({
        data: {
          name: 'Cardiology',
          description: 'Heart and cardiovascular system care',
          headOfDept: 'Dr. Priya Sharma',
          phone: '+91-22-12345680',
          email: 'cardiology@medcorehospital.com',
          hospitalId: hospital.id,
        },
      }),
      this.prisma.department.create({
        data: {
          name: 'Neurology',
          description: 'Brain and nervous system care',
          headOfDept: 'Dr. Rajesh Patel',
          phone: '+91-22-12345681',
          email: 'neurology@medcorehospital.com',
          hospitalId: hospital.id,
        },
      }),
      this.prisma.department.create({
        data: {
          name: 'Orthopedics',
          description: 'Bone and joint care',
          headOfDept: 'Dr. Amit Kumar',
          phone: '+91-22-12345682',
          email: 'orthopedics@medcorehospital.com',
          hospitalId: hospital.id,
        },
      }),
      this.prisma.department.create({
        data: {
          name: 'General Medicine',
          description: 'General healthcare and internal medicine',
          headOfDept: 'Dr. Sunita Desai',
          phone: '+91-22-12345683',
          email: 'general@medcorehospital.com',
          hospitalId: hospital.id,
        },
      }),
    ]);

    const doctorUsers = await Promise.all([
      this.prisma.user.create({
        data: {
          email: 'dr.priya@medcore.com',
          password,
          firstName: 'Priya',
          lastName: 'Sharma',
          phone: '+91-9876543220',
          role: 'DOCTOR',
          hospitalId: hospital.id,
        },
      }),
      this.prisma.user.create({
        data: {
          email: 'dr.rajesh@medcore.com',
          password,
          firstName: 'Rajesh',
          lastName: 'Patel',
          phone: '+91-9876543221',
          role: 'DOCTOR',
          hospitalId: hospital.id,
        },
      }),
      this.prisma.user.create({
        data: {
          email: 'dr.amit@medcore.com',
          password,
          firstName: 'Amit',
          lastName: 'Kumar',
          phone: '+91-9876543222',
          role: 'DOCTOR',
          hospitalId: hospital.id,
        },
      }),
    ]);

    const doctors = await Promise.all([
      this.prisma.doctor.create({
        data: {
          userId: doctorUsers[0].id,
          hospitalId: hospital.id,
          departmentId: departments[0].id,
          licenseNumber: 'MCI-2015-1234',
          specialization: 'Interventional Cardiology',
          qualifications: 'MBBS, MD Cardiology, DM Interventional Cardiology',
          experience: 12,
          consultationFee: 1500,
          bio: 'Experienced cardiologist specializing in interventional procedures.',
          availableDays: 'Mon,Tue,Wed,Thu,Fri',
          availableFrom: '09:00',
          availableTo: '17:00',
        },
      }),
      this.prisma.doctor.create({
        data: {
          userId: doctorUsers[1].id,
          hospitalId: hospital.id,
          departmentId: departments[1].id,
          licenseNumber: 'MCI-2016-5678',
          specialization: 'Neurosurgery',
          qualifications: 'MBBS, MS Neurosurgery, Fellowship in Spine Surgery',
          experience: 15,
          consultationFee: 2000,
          bio: 'Expert neurosurgeon with extensive experience in complex brain surgeries.',
          availableDays: 'Mon,Wed,Fri',
          availableFrom: '10:00',
          availableTo: '16:00',
        },
      }),
      this.prisma.doctor.create({
        data: {
          userId: doctorUsers[2].id,
          hospitalId: hospital.id,
          departmentId: departments[2].id,
          licenseNumber: 'MCI-2017-9012',
          specialization: 'Joint Replacement',
          qualifications: 'MBBS, MS Orthopedics, Fellowship in Joint Replacement',
          experience: 10,
          consultationFee: 1200,
          bio: 'Specialist in knee and hip replacement surgeries.',
          availableDays: 'Tue,Thu,Sat',
          availableFrom: '09:00',
          availableTo: '15:00',
        },
      }),
    ]);

    const patientUsers = await Promise.all([
      this.prisma.user.create({
        data: {
          email: 'rahul.gupta@email.com',
          password,
          firstName: 'Rahul',
          lastName: 'Gupta',
          phone: '+91-9876543230',
          role: 'PATIENT',
          hospitalId: hospital.id,
        },
      }),
      this.prisma.user.create({
        data: {
          email: 'sneha.verma@email.com',
          password,
          firstName: 'Sneha',
          lastName: 'Verma',
          phone: '+91-9876543231',
          role: 'PATIENT',
          hospitalId: hospital.id,
        },
      }),
      this.prisma.user.create({
        data: {
          email: 'arjun.singh@email.com',
          password,
          firstName: 'Arjun',
          lastName: 'Singh',
          phone: '+91-9876543232',
          role: 'PATIENT',
          hospitalId: hospital.id,
        },
      }),
      this.prisma.user.create({
        data: {
          email: 'priyanka.joshi@email.com',
          password,
          firstName: 'Priyanka',
          lastName: 'Joshi',
          phone: '+91-9876543233',
          role: 'PATIENT',
          hospitalId: hospital.id,
        },
      }),
      this.prisma.user.create({
        data: {
          email: 'vikram.mehta@email.com',
          password,
          firstName: 'Vikram',
          lastName: 'Mehta',
          phone: '+91-9876543234',
          role: 'PATIENT',
          hospitalId: hospital.id,
        },
      }),
    ]);

    const patients = await Promise.all([
      this.prisma.patient.create({
        data: {
          userId: patientUsers[0].id,
          hospitalId: hospital.id,
          mrn: 'MRN-00001',
          dateOfBirth: new Date('1985-06-15'),
          gender: 'MALE',
          bloodGroup: 'B+',
          allergies: 'Penicillin',
          emergencyContact: 'Rita Gupta',
          emergencyPhone: '+91-9876543240',
          insuranceProvider: 'Star Health',
          insuranceNumber: 'SH-123456',
          address: '45 Andheri West, Mumbai',
        },
      }),
      this.prisma.patient.create({
        data: {
          userId: patientUsers[1].id,
          hospitalId: hospital.id,
          mrn: 'MRN-00002',
          dateOfBirth: new Date('1990-03-22'),
          gender: 'FEMALE',
          bloodGroup: 'A+',
          emergencyContact: 'Manoj Verma',
          emergencyPhone: '+91-9876543241',
          address: '78 Bandra East, Mumbai',
        },
      }),
      this.prisma.patient.create({
        data: {
          userId: patientUsers[2].id,
          hospitalId: hospital.id,
          mrn: 'MRN-00003',
          dateOfBirth: new Date('1978-11-08'),
          gender: 'MALE',
          bloodGroup: 'O+',
          allergies: 'Aspirin',
          emergencyContact: 'Kavita Singh',
          emergencyPhone: '+91-9876543242',
          insuranceProvider: 'ICICI Lombard',
          insuranceNumber: 'IL-789012',
          address: '12 Powai, Mumbai',
        },
      }),
      this.prisma.patient.create({
        data: {
          userId: patientUsers[3].id,
          hospitalId: hospital.id,
          mrn: 'MRN-00004',
          dateOfBirth: new Date('1995-08-17'),
          gender: 'FEMALE',
          bloodGroup: 'AB+',
          emergencyContact: 'Sanjay Joshi',
          emergencyPhone: '+91-9876543243',
          address: '90 Juhu, Mumbai',
        },
      }),
      this.prisma.patient.create({
        data: {
          userId: patientUsers[4].id,
          hospitalId: hospital.id,
          mrn: 'MRN-00005',
          dateOfBirth: new Date('1982-12-03'),
          gender: 'MALE',
          bloodGroup: 'A-',
          emergencyContact: 'Neha Mehta',
          emergencyPhone: '+91-9876543244',
          insuranceProvider: 'Bajaj Allianz',
          insuranceNumber: 'BA-345678',
          address: '34 Dadar, Mumbai',
        },
      }),
    ]);

    await Promise.all([
      this.prisma.user.create({
        data: {
          email: 'pharmacist1@medcore.com',
          password,
          firstName: 'Rakesh',
          lastName: 'Pharma',
          phone: '+91-9876543250',
          role: 'PHARMACIST',
          hospitalId: hospital.id,
        },
      }),
      this.prisma.user.create({
        data: {
          email: 'pharmacist2@medcore.com',
          password,
          firstName: 'Meena',
          lastName: 'Pharma',
          phone: '+91-9876543251',
          role: 'PHARMACIST',
          hospitalId: hospital.id,
        },
      }),
      this.prisma.user.create({
        data: {
          email: 'labtech1@medcore.com',
          password,
          firstName: 'Suresh',
          lastName: 'Lab',
          phone: '+91-9876543252',
          role: 'LAB_TECHNICIAN',
          hospitalId: hospital.id,
        },
      }),
      this.prisma.user.create({
        data: {
          email: 'labtech2@medcore.com',
          password,
          firstName: 'Anjali',
          lastName: 'Lab',
          phone: '+91-9876543253',
          role: 'LAB_TECHNICIAN',
          hospitalId: hospital.id,
        },
      }),
      this.prisma.user.create({
        data: {
          email: 'nurse1@medcore.com',
          password,
          firstName: 'Kavita',
          lastName: 'Nurse',
          phone: '+91-9876543254',
          role: 'NURSE',
          hospitalId: hospital.id,
        },
      }),
      this.prisma.user.create({
        data: {
          email: 'nurse2@medcore.com',
          password,
          firstName: 'Deepa',
          lastName: 'Nurse',
          phone: '+91-9876543255',
          role: 'NURSE',
          hospitalId: hospital.id,
        },
      }),
    ]);

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    await Promise.all([
      this.prisma.appointment.create({
        data: {
          patientId: patients[0].id,
          doctorId: doctors[0].id,
          hospitalId: hospital.id,
          departmentId: departments[0].id,
          date: tomorrow,
          startTime: '10:00',
          endTime: '10:30',
          status: 'SCHEDULED',
          reason: 'Chest pain evaluation',
        },
      }),
      this.prisma.appointment.create({
        data: {
          patientId: patients[1].id,
          doctorId: doctors[1].id,
          hospitalId: hospital.id,
          departmentId: departments[1].id,
          date: tomorrow,
          startTime: '11:00',
          endTime: '11:30',
          status: 'CONFIRMED',
          reason: 'Persistent headaches',
        },
      }),
      this.prisma.appointment.create({
        data: {
          patientId: patients[2].id,
          doctorId: doctors[2].id,
          hospitalId: hospital.id,
          departmentId: departments[2].id,
          date: nextWeek,
          startTime: '09:00',
          endTime: '09:30',
          status: 'SCHEDULED',
          reason: 'Knee pain consultation',
        },
      }),
    ]);

    await Promise.all([
      this.prisma.medicine.create({
        data: {
          name: 'Metformin 500mg',
          genericName: 'Metformin Hydrochloride',
          category: 'TABLET',
          manufacturer: 'Sun Pharma',
          price: 45.5,
          stock: 500,
          unit: 'tablet',
          description: 'Oral diabetes medicine to control blood sugar levels.',
          hospitalId: hospital.id,
        },
      }),
      this.prisma.medicine.create({
        data: {
          name: 'Amoxicillin 500mg',
          genericName: 'Amoxicillin',
          category: 'CAPSULE',
          manufacturer: 'Cipla',
          price: 85.0,
          stock: 300,
          unit: 'capsule',
          description: 'Broad-spectrum antibiotic for bacterial infections.',
          hospitalId: hospital.id,
        },
      }),
      this.prisma.medicine.create({
        data: {
          name: 'Atorvastatin 10mg',
          genericName: 'Atorvastatin Calcium',
          category: 'CARDIOVASCULAR',
          manufacturer: 'Dr. Reddy\'s',
          price: 120.0,
          stock: 250,
          unit: 'tablet',
          description: 'Statin medication for lowering cholesterol levels.',
          hospitalId: hospital.id,
        },
      }),
      this.prisma.medicine.create({
        data: {
          name: 'Omeprazole 20mg',
          genericName: 'Omeprazole',
          category: 'CAPSULE',
          manufacturer: 'AstraZeneca',
          price: 95.0,
          stock: 400,
          unit: 'capsule',
          description: 'Proton pump inhibitor for acid reflux treatment.',
          hospitalId: hospital.id,
        },
      }),
      this.prisma.medicine.create({
        data: {
          name: 'Paracetamol 500mg',
          genericName: 'Acetaminophen',
          category: 'TABLET',
          manufacturer: 'GSK',
          price: 25.0,
          stock: 1000,
          unit: 'tablet',
          description: 'Pain reliever and fever reducer.',
          hospitalId: hospital.id,
        },
      }),
    ]);

    this.logger.log('Database seeded successfully!');
    this.logger.log('Login credentials:');
    this.logger.log('  Super Admin: superadmin@medcore.com / MedCore@123');
    this.logger.log('  Hospital Admin: hospitaladmin@medcore.com / MedCore@123');
    this.logger.log('  Doctor 1: dr.priya@medcore.com / MedCore@123');
    this.logger.log('  Doctor 2: dr.rajesh@medcore.com / MedCore@123');
    this.logger.log('  Doctor 3: dr.amit@medcore.com / MedCore@123');

    return {
      hospital,
      superAdmin,
      hospitalAdmin,
      departments,
      doctors,
      patients,
      message: 'Database seeded successfully',
    };
  }
}
