import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from '@prisma/client';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto, hospitalId?: string, departmentId?: string): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (hospitalId) {
      where.hospitalId = hospitalId;
    }
    if (departmentId) {
      where.departmentId = departmentId;
    }
    if (search) {
      where.OR = [
        { user: { firstName: { contains: search } } },
        { user: { lastName: { contains: search } } },
        { specialization: { contains: search } },
        { licenseNumber: { contains: search } },
      ];
    }

    const [doctors, total] = await Promise.all([
      this.prisma.doctor.findMany({
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
              avatar: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              appointments: true,
              prescriptions: true,
              medicalRecords: true,
            },
          },
        },
      }),
      this.prisma.doctor.count({ where }),
    ]);

    return new PaginatedResult(doctors, total, page, limit);
  }

  async findById(id: string) {
    return this.prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
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
            prescriptions: true,
            medicalRecords: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.doctor.findUnique({
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
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.prisma.doctor.create({
      data: createDoctorDto,
    });
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.findById(id);
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return this.prisma.doctor.update({
      where: { id },
      data: updateDoctorDto,
    });
  }

  async remove(id: string): Promise<Doctor> {
    const doctor = await this.findById(id);
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return this.prisma.doctor.delete({ where: { id } });
  }
}
