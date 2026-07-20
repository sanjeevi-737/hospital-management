import { IsUUID, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ description: 'User ID to receive notification' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'Appointment Reminder' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'You have an appointment tomorrow at 10 AM' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ example: 'INFO', enum: ['INFO', 'WARNING', 'ERROR', 'APPOINTMENT_REMINDER', 'LAB_RESULT', 'PAYMENT'] })
  @IsOptional()
  @IsString()
  type?: string;
}
