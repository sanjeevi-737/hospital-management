import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from '@prisma/client';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto, hospitalId?: string): Promise<PaginatedResult<Department>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (hospitalId) {
      where.hospitalId = hospitalId;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [departments, total] = await Promise.all([
      this.prisma.department.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              doctors: true,
              appointments: true,
            },
          },
        },
      }),
      this.prisma.department.count({ where }),
    ]);

    return new PaginatedResult(departments, total, page, limit);
  }

  async findById(id: string): Promise<Department | null> {
    return this.prisma.department.findUnique({
      where: { id },
      include: {
        doctors: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        _count: {
          select: {
            doctors: true,
            appointments: true,
          },
        },
      },
    });
  }

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    return this.prisma.department.create({
      data: createDepartmentDto,
    });
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findById(id);
    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return this.prisma.department.update({
      where: { id },
      data: updateDepartmentDto,
    });
  }

  async remove(id: string): Promise<Department> {
    const department = await this.findById(id);
    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return this.prisma.department.delete({ where: { id } });
  }
}
