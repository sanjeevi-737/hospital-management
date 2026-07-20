import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from '@prisma/client';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto, hospitalId?: string): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (hospitalId) {
      where.hospitalId = hospitalId;
    }
    if (search) {
      where.OR = [
        { user: { firstName: { contains: search } } },
        { user: { lastName: { contains: search } } },
        { user: { email: { contains: search } } },
        { mrn: { contains: search } },
      ];
    }

    const [patients, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          _count: {
            select: {
              appointments: true,
              medicalRecords: true,
              prescriptions: true,
            },
          },
        },
      }),
      this.prisma.patient.count({ where }),
    ]);

    return new PaginatedResult(patients, total, page, limit);
  }

  async findById(id: string) {
    return this.prisma.patient.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        hospital: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            appointments: true,
            medicalRecords: true,
            prescriptions: true,
            labOrders: true,
            invoices: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.patient.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const mrn = `MRN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    return this.prisma.patient.create({
      data: {
        ...createPatientDto,
        mrn,
      },
    });
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findById(id);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.prisma.patient.update({
      where: { id },
      data: updatePatientDto,
    });
  }

  async remove(id: string): Promise<Patient> {
    const patient = await this.findById(id);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.prisma.patient.delete({ where: { id } });
  }
}
