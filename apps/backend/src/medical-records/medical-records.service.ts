import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';

@Injectable()
export class MedicalRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto, patientId?: string, doctorId?: string): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (doctorId) where.doctorId = doctorId;

    const [records, total] = await Promise.all([
      this.prisma.medicalRecord.findMany({
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
        },
      }),
      this.prisma.medicalRecord.count({ where }),
    ]);

    return new PaginatedResult(records, total, page, limit);
  }

  async findById(id: string) {
    return this.prisma.medicalRecord.findUnique({
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
      },
    });
  }

  async create(dto: CreateMedicalRecordDto) {
    return this.prisma.medicalRecord.create({
      data: dto,
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
      },
    });
  }

  async update(id: string, dto: UpdateMedicalRecordDto) {
    const record = await this.findById(id);
    if (!record) {
      throw new NotFoundException('Medical record not found');
    }

    return this.prisma.medicalRecord.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const record = await this.findById(id);
    if (!record) {
      throw new NotFoundException('Medical record not found');
    }

    return this.prisma.medicalRecord.delete({ where: { id } });
  }
}
