import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';
import { UpdateLabOrderDto } from './dto/update-lab-order.dto';
import { AddLabResultDto } from './dto/add-lab-result.dto';
import { LabOrderStatus } from '@/common/enums';

@Injectable()
export class LabService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto, hospitalId?: string, patientId?: string): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (hospitalId) where.hospitalId = hospitalId;
    if (patientId) where.patientId = patientId;
    if (search) {
      where.OR = [
        { testName: { contains: search } },
        { testType: { contains: search } },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.labOrder.findMany({
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
        },
      }),
      this.prisma.labOrder.count({ where }),
    ]);

    return new PaginatedResult(orders, total, page, limit);
  }

  async findById(id: string) {
    return this.prisma.labOrder.findUnique({
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
      },
    });
  }

  async create(dto: CreateLabOrderDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: dto.patientId },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.prisma.labOrder.create({
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
      },
    });
  }

  async addResult(orderId: string, resultDto: AddLabResultDto) {
    const order = await this.findById(orderId);
    if (!order) {
      throw new NotFoundException('Lab order not found');
    }

    return this.prisma.labOrder.update({
      where: { id: orderId },
      data: {
        status: LabOrderStatus.COMPLETED,
        result: resultDto as any,
        resultDate: new Date(),
      },
    });
  }

  async updateStatus(id: string, status: LabOrderStatus) {
    const order = await this.findById(id);
    if (!order) {
      throw new NotFoundException('Lab order not found');
    }

    return this.prisma.labOrder.update({
      where: { id },
      data: { status },
    });
  }

  async getByPatient(patientId: string) {
    return this.prisma.labOrder.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: UpdateLabOrderDto) {
    const order = await this.findById(id);
    if (!order) {
      throw new NotFoundException('Lab order not found');
    }

    return this.prisma.labOrder.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const order = await this.findById(id);
    if (!order) {
      throw new NotFoundException('Lab order not found');
    }

    return this.prisma.labOrder.delete({ where: { id } });
  }
}
