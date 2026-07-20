import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentStatus } from '@/common/enums';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto, hospitalId?: string, doctorId?: string, patientId?: string): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (hospitalId) where.hospitalId = hospitalId;
    if (doctorId) where.doctorId = doctorId;
    if (patientId) where.patientId = patientId;

    const [appointments, total] = await Promise.all([
      this.prisma.appointment.findMany({
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
                  phone: true,
                },
              },
            },
          },
          doctor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
              department: {
                select: {
                  name: true,
                },
              },
            },
          },
          department: {
            select: {
              name: true,
            },
          },
        },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return new PaginatedResult(appointments, total, page, limit);
  }

  async findById(id: string) {
    return this.prisma.appointment.findUnique({
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
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            department: {
              select: {
                name: true,
              },
            },
          },
        },
        department: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async create(createAppointmentDto: CreateAppointmentDto) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: createAppointmentDto.doctorId },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const patient = await this.prisma.patient.findUnique({
      where: { id: createAppointmentDto.patientId },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const overlapping = await this.prisma.appointment.findFirst({
      where: {
        doctorId: createAppointmentDto.doctorId,
        date: new Date(createAppointmentDto.date),
        status: {
          notIn: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW],
        },
        AND: [
          { startTime: { lt: createAppointmentDto.endTime } },
          { endTime: { gt: createAppointmentDto.startTime } },
        ],
      },
    });

    if (overlapping) {
      throw new BadRequestException('This time slot overlaps with an existing appointment for this doctor');
    }

    return this.prisma.appointment.create({
      data: {
        patientId: createAppointmentDto.patientId,
        doctorId: createAppointmentDto.doctorId,
        hospitalId: createAppointmentDto.hospitalId,
        departmentId: createAppointmentDto.departmentId,
        date: new Date(createAppointmentDto.date),
        startTime: createAppointmentDto.startTime,
        endTime: createAppointmentDto.endTime,
        reason: createAppointmentDto.reason,
        notes: createAppointmentDto.notes,
      },
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
        doctor: {
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

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.findById(id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: {
        ...updateAppointmentDto,
        date: updateAppointmentDto.date ? new Date(updateAppointmentDto.date) : undefined,
      },
    });
  }

  async updateStatus(id: string, status: AppointmentStatus) {
    const appointment = await this.findById(id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }

  async getDoctorAvailability(doctorId: string, date: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const bookedAppointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        date: new Date(date),
        status: {
          notIn: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW],
        },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    return {
      doctorId,
      date,
      availableDays: doctor.availableDays,
      availableFrom: doctor.availableFrom,
      availableTo: doctor.availableTo,
      bookedSlots: bookedAppointments,
    };
  }

  async remove(id: string) {
    const appointment = await this.findById(id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return this.prisma.appointment.delete({ where: { id } });
  }
}
