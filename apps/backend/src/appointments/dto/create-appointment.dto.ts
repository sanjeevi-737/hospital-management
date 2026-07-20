import { IsUUID, IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: '2024-03-15' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '10:00' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '10:30' })
  @IsString()
  endTime: string;

  @ApiPropertyOptional({ example: 'Regular checkup' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ example: 'Follow-up visit' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Patient ID' })
  @IsUUID()
  patientId: string;

  @ApiProperty({ description: 'Doctor ID' })
  @IsUUID()
  doctorId: string;

  @ApiProperty({ description: 'Hospital ID' })
  @IsUUID()
  hospitalId: string;

  @ApiPropertyOptional({ description: 'Department ID' })
  @IsOptional()
  @IsUUID()
  departmentId?: string;
}
