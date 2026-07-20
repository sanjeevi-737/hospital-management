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
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@/common/enums';

@ApiTags('prescriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.PHARMACIST)
  @ApiOperation({ summary: 'Get all prescriptions' })
  @ApiResponse({ status: 200, description: 'Prescriptions retrieved successfully' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
  ) {
    return this.prescriptionsService.findAll(paginationDto, patientId, doctorId);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.PHARMACIST)
  @ApiOperation({ summary: 'Get prescription by ID' })
  @ApiResponse({ status: 200, description: 'Prescription retrieved successfully' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.prescriptionsService.findById(id);
  }

  @Post()
  @Roles(UserRole.DOCTOR)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new prescription' })
  @ApiResponse({ status: 201, description: 'Prescription created successfully' })
  async create(@Body() dto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.DOCTOR, UserRole.PHARMACIST)
  @ApiOperation({ summary: 'Update prescription' })
  @ApiResponse({ status: 200, description: 'Prescription updated successfully' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePrescriptionDto,
  ) {
    return this.prescriptionsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete prescription' })
  @ApiResponse({ status: 200, description: 'Prescription deleted successfully' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.prescriptionsService.remove(id);
  }
}
