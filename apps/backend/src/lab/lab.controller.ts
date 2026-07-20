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
import { LabService } from './lab.service';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';
import { UpdateLabOrderDto } from './dto/update-lab-order.dto';
import { AddLabResultDto } from './dto/add-lab-result.dto';
import { UpdateLabOrderStatusDto } from './dto/update-lab-order-status.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@/common/enums';

@ApiTags('lab')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lab')
export class LabController {
  constructor(private readonly labService: LabService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  @ApiOperation({ summary: 'Get all lab orders' })
  @ApiResponse({ status: 200, description: 'Lab orders retrieved successfully' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('hospitalId') hospitalId?: string,
    @Query('patientId') patientId?: string,
  ) {
    return this.labService.findAll(paginationDto, hospitalId, patientId);
  }

  @Get('patient/:patientId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  @ApiOperation({ summary: 'Get lab orders by patient' })
  @ApiResponse({ status: 200, description: 'Lab orders retrieved successfully' })
  async getByPatient(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return this.labService.getByPatient(patientId);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR, UserRole.LAB_TECHNICIAN)
  @ApiOperation({ summary: 'Get lab order by ID' })
  @ApiResponse({ status: 200, description: 'Lab order retrieved successfully' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.labService.findById(id);
  }

  @Post()
  @Roles(UserRole.DOCTOR)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new lab order' })
  @ApiResponse({ status: 201, description: 'Lab order created successfully' })
  async create(@Body() dto: CreateLabOrderDto) {
    return this.labService.create(dto);
  }

  @Patch(':id/result')
  @Roles(UserRole.LAB_TECHNICIAN)
  @ApiOperation({ summary: 'Add lab result' })
  @ApiResponse({ status: 200, description: 'Result added successfully' })
  async addResult(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddLabResultDto,
  ) {
    return this.labService.addResult(id, dto);
  }

  @Patch(':id/status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.LAB_TECHNICIAN)
  @ApiOperation({ summary: 'Update lab order status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLabOrderStatusDto,
  ) {
    return this.labService.updateStatus(id, dto.status);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.LAB_TECHNICIAN)
  @ApiOperation({ summary: 'Update lab order' })
  @ApiResponse({ status: 200, description: 'Lab order updated successfully' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLabOrderDto,
  ) {
    return this.labService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete lab order' })
  @ApiResponse({ status: 200, description: 'Lab order deleted successfully' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.labService.remove(id);
  }
}
