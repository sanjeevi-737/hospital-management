import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { GenerateInvoiceDto } from './dto/generate-invoice.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@/common/enums';

@ApiTags('billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('invoices')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN)
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiResponse({ status: 200, description: 'Invoices retrieved successfully' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('hospitalId') hospitalId?: string,
    @Query('patientId') patientId?: string,
  ) {
    return this.billingService.findAll(paginationDto, hospitalId, patientId);
  }

  @Get('invoices/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiResponse({ status: 200, description: 'Invoice retrieved successfully' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.billingService.findById(id);
  }

  @Get('revenue-report')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN)
  @ApiOperation({ summary: 'Get revenue report' })
  @ApiResponse({ status: 200, description: 'Revenue report generated' })
  async getRevenueReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('hospitalId') hospitalId?: string,
  ) {
    return this.billingService.getRevenueReport(startDate, endDate, hospitalId);
  }

  @Post('invoices')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.RECEPTIONIST)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate a new invoice' })
  @ApiResponse({ status: 201, description: 'Invoice generated successfully' })
  async generateInvoice(@Body() dto: GenerateInvoiceDto) {
    return this.billingService.generateInvoice(dto);
  }

  @Post('invoices/:id/pay')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.RECEPTIONIST)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process payment for an invoice' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  async processPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ProcessPaymentDto,
  ) {
    return this.billingService.processPayment(id, dto);
  }

  @Delete('invoices/:id')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete invoice' })
  @ApiResponse({ status: 200, description: 'Invoice deleted successfully' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.billingService.remove(id);
  }
}
