import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@/common/enums';

@ApiTags('medicines')
@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all medicines' })
  @ApiResponse({ status: 200, description: 'Medicines retrieved successfully' })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.medicinesService.findAll(paginationDto);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get medicine by ID' })
  @ApiResponse({ status: 200, description: 'Medicine retrieved successfully' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.medicinesService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.PHARMACIST)
  @Post()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new medicine' })
  @ApiResponse({ status: 201, description: 'Medicine added successfully' })
  async create(@Body() dto: CreateMedicineDto) {
    return this.medicinesService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.PHARMACIST)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update medicine' })
  @ApiResponse({ status: 200, description: 'Medicine updated successfully' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMedicineDto,
  ) {
    return this.medicinesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.PHARMACIST)
  @Patch(':id/stock')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update medicine stock' })
  @ApiResponse({ status: 200, description: 'Stock updated successfully' })
  async updateStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.medicinesService.updateStock(id, quantity);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete medicine' })
  @ApiResponse({ status: 200, description: 'Medicine deleted successfully' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.medicinesService.remove(id);
  }
}
