import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationsGateway,
  ) {}

  async create(dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        title: dto.title,
        message: dto.message,
        type: dto.type || 'INFO',
      },
    });

    this.gateway.sendNotification(dto.userId, notification);

    return notification;
  }

  async findByUser(userId: string, unreadOnly = false) {
    const where: any = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { count };
  }

  async sendAppointmentReminder(userId: string, doctorName: string, date: string, time: string) {
    return this.create({
      userId,
      title: 'Appointment Reminder',
      message: `You have an appointment with Dr. ${doctorName} on ${date} at ${time}`,
      type: 'APPOINTMENT_REMINDER',
    });
  }

  async sendLabResultNotification(userId: string, testName: string) {
    return this.create({
      userId,
      title: 'Lab Results Ready',
      message: `Your ${testName} results are now available`,
      type: 'LAB_RESULT',
    });
  }

  async sendPaymentConfirmation(userId: string, amount: number, invoiceNumber: string) {
    return this.create({
      userId,
      title: 'Payment Confirmed',
      message: `Payment of ₹${amount} received for invoice ${invoiceNumber}`,
      type: 'PAYMENT',
    });
  }
}
