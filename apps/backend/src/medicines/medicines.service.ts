import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { Medicine } from '@prisma/client';

@Injectable()
export class MedicinesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Medicine>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { genericName: { contains: search } },
        { manufacturer: { contains: search } },
      ];
    }

    const [medicines, total] = await Promise.all([
      this.prisma.medicine.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.medicine.count({ where }),
    ]);

    return new PaginatedResult(medicines, total, page, limit);
  }

  async findById(id: string): Promise<Medicine | null> {
    return this.prisma.medicine.findUnique({ where: { id } });
  }

  async create(dto: CreateMedicineDto): Promise<Medicine> {
    return this.prisma.medicine.create({ data: dto });
  }

  async update(id: string, dto: UpdateMedicineDto): Promise<Medicine> {
    const medicine = await this.findById(id);
    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }

    return this.prisma.medicine.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string): Promise<Medicine> {
    const medicine = await this.findById(id);
    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }

    return this.prisma.medicine.delete({ where: { id } });
  }

  async updateStock(id: string, quantity: number): Promise<Medicine> {
    const medicine = await this.findById(id);
    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }

    return this.prisma.medicine.update({
      where: { id },
      data: {
        stock: {
          increment: quantity,
        },
      },
    });
  }
}
