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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@/common/enums';

@ApiTags('medical-records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get all medical records' })
  @ApiResponse({ status: 200, description: 'Medical records retrieved successfully' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
  ) {
    return this.medicalRecordsService.findAll(paginationDto, patientId, doctorId);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get medical record by ID' })
  @ApiResponse({ status: 200, description: 'Medical record retrieved successfully' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.medicalRecordsService.findById(id);
  }

  @Post()
  @Roles(UserRole.DOCTOR)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a medical record' })
  @ApiResponse({ status: 201, description: 'Medical record created successfully' })
  async create(@Body() dto: CreateMedicalRecordDto) {
    return this.medicalRecordsService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Update medical record' })
  @ApiResponse({ status: 200, description: 'Medical record updated successfully' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMedicalRecordDto,
  ) {
    return this.medicalRecordsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete medical record' })
  @ApiResponse({ status: 200, description: 'Medical record deleted successfully' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.medicalRecordsService.remove(id);
  }
}
