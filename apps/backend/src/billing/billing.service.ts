import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { GenerateInvoiceDto } from './dto/generate-invoice.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { PaymentStatus } from '@/common/enums';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto, hospitalId?: string, patientId?: string): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (hospitalId) where.hospitalId = hospitalId;
    if (patientId) where.patientId = patientId;
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search } },
        { patient: { user: { firstName: { contains: search } } } },
        { patient: { user: { lastName: { contains: search } } } },
      ];
    }

    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
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
                  email: true,
                },
              },
            },
          },
          items: true,
        },
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return new PaginatedResult(invoices, total, page, limit);
  }

  async findById(id: string) {
    return this.prisma.invoice.findUnique({
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
        hospital: {
          select: {
            name: true,
            address: true,
            phone: true,
            email: true,
          },
        },
        items: true,
        payments: true,
      },
    });
  }

  async generateInvoice(dto: GenerateInvoiceDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: dto.patientId },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const invoiceCount = await this.prisma.invoice.count({
      where: { hospitalId: dto.hospitalId },
    });
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(5, '0')}`;

    const totalAmount = dto.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const taxAmount = totalAmount * 0.18;
    const discount = dto.discount || 0;
    const netAmount = totalAmount + taxAmount - discount;

    return this.prisma.invoice.create({
      data: {
        invoiceNumber,
        totalAmount,
        discount,
        taxAmount,
        netAmount,
        patientId: dto.patientId,
        hospitalId: dto.hospitalId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        notes: dto.notes,
        items: {
          create: dto.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          })),
        },
      },
      include: {
        items: true,
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

  async processPayment(invoiceId: string, dto: ProcessPaymentDto) {
    const invoice = await this.findById(invoiceId);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Invoice is already paid');
    }

    const existingPayments = await this.prisma.payment.findMany({
      where: { invoiceId },
      select: { amount: true, status: true },
    });

    const alreadyPaid = existingPayments
      .filter((p) => p.status === PaymentStatus.PAID)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const remainingAmount = Number(invoice.netAmount) - alreadyPaid;

    if (dto.amount > remainingAmount) {
      throw new BadRequestException(
        `Payment amount exceeds remaining balance of ${remainingAmount.toFixed(2)}`,
      );
    }

    const totalAfterPayment = alreadyPaid + dto.amount;
    let newStatus: PaymentStatus;

    if (totalAfterPayment >= Number(invoice.netAmount)) {
      newStatus = PaymentStatus.PAID;
    } else {
      newStatus = PaymentStatus.PARTIALLY_PAID;
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          invoiceId,
          amount: dto.amount,
          paymentMethod: dto.paymentMethod,
          transactionId: dto.transactionId,
          status: PaymentStatus.PAID,
          notes: dto.notes,
        },
      });

      return tx.invoice.update({
        where: { id: invoiceId },
        data: {
          paymentStatus: newStatus,
          paidAt: newStatus === PaymentStatus.PAID ? new Date() : undefined,
        },
        include: {
          items: true,
        },
      });
    });
  }

  async getRevenueReport(startDate: string, endDate: string, hospitalId?: string) {
    const where: any = {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
      paymentStatus: PaymentStatus.PAID,
    };

    if (hospitalId) {
      where.hospitalId = hospitalId;
    }

    const invoices = await this.prisma.invoice.findMany({
      where,
      select: {
        totalAmount: true,
        taxAmount: true,
        discount: true,
        netAmount: true,
        paymentMethod: true,
        paidAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.netAmount, 0);
    const totalTax = invoices.reduce((sum, inv) => sum + inv.taxAmount, 0);
    const totalDiscount = invoices.reduce((sum, inv) => sum + inv.discount, 0);
    const invoiceCount = invoices.length;

    const paymentMethodBreakdown = invoices.reduce((acc, inv) => {
      const method = inv.paymentMethod || 'UNKNOWN';
      if (!acc[method]) {
        acc[method] = { count: 0, total: 0 };
      }
      acc[method].count += 1;
      acc[method].total += inv.netAmount;
      return acc;
    }, {} as Record<string, { count: number; total: number }>);

    return {
      period: { startDate, endDate },
      totalRevenue,
      totalTax,
      totalDiscount,
      invoiceCount,
      averageInvoiceValue: invoiceCount > 0 ? totalRevenue / invoiceCount : 0,
      paymentMethodBreakdown,
      invoices,
    };
  }

  async remove(id: string) {
    const invoice = await this.findById(id);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return this.prisma.invoice.delete({ where: { id } });
  }
}
