import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { Hospital } from '@prisma/client';

@Injectable()
export class HospitalsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Hospital>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { city: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [hospitals, total] = await Promise.all([
      this.prisma.hospital.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              departments: true,
              doctors: true,
              patients: true,
            },
          },
        },
      }),
      this.prisma.hospital.count({ where }),
    ]);

    return new PaginatedResult(hospitals, total, page, limit);
  }

  async findById(id: string): Promise<Hospital | null> {
    return this.prisma.hospital.findUnique({
      where: { id },
      include: {
        departments: true,
        _count: {
          select: {
            doctors: true,
            patients: true,
            appointments: true,
          },
        },
      },
    });
  }

  async create(createHospitalDto: CreateHospitalDto): Promise<Hospital> {
    return this.prisma.hospital.create({
      data: createHospitalDto,
    });
  }

  async update(id: string, updateHospitalDto: UpdateHospitalDto): Promise<Hospital> {
    const hospital = await this.findById(id);
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    return this.prisma.hospital.update({
      where: { id },
      data: updateHospitalDto,
    });
  }

  async remove(id: string): Promise<Hospital> {
    const hospital = await this.findById(id);
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    return this.prisma.hospital.delete({ where: { id } });
  }
}
