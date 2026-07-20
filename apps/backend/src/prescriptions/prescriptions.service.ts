import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { PrescriptionStatus } from '@/common/enums';

@Injectable()
export class PrescriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto, patientId?: string, doctorId?: string): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (doctorId) where.doctorId = doctorId;

    const [prescriptions, total] = await Promise.all([
      this.prisma.prescription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          patient: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          doctor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          medications: true,
        },
      }),
      this.prisma.prescription.count({ where }),
    ]);

    return new PaginatedResult(prescriptions, total, page, limit);
  }

  async findById(id: string) {
    return this.prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            department: {
              select: {
                name: true,
              },
            },
          },
        },
        medications: true,
      },
    });
  }

  async create(dto: CreatePrescriptionDto) {
    const { medications, ...prescriptionData } = dto;

    return this.prisma.prescription.create({
      data: {
        ...prescriptionData,
        validUntil: prescriptionData.validUntil ? new Date(prescriptionData.validUntil) : undefined,
        medications: medications
          ? {
              create: medications,
            }
          : undefined,
      },
      include: {
        medications: true,
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdatePrescriptionDto) {
    const prescription = await this.findById(id);
    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    return this.prisma.prescription.update({
      where: { id },
      data: {
        status: dto.status,
        notes: dto.notes,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
      },
    });
  }

  async remove(id: string) {
    const prescription = await this.findById(id);
    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    return this.prisma.prescription.delete({ where: { id } });
  }
}
