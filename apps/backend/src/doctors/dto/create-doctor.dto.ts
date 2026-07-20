import { IsString, IsUUID, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty({ example: 'DOC-12345' })
  @IsString()
  licenseNumber: string;

  @ApiProperty({ example: 'Cardiology' })
  @IsString()
  specialization: string;

  @ApiProperty({ example: 'MBBS, MD Cardiology' })
  @IsString()
  qualifications: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  experience?: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  consultationFee?: number;

  @ApiPropertyOptional({ example: 'Experienced cardiologist...' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 'Mon,Tue,Wed,Thu,Fri' })
  @IsOptional()
  @IsString()
  availableDays?: string;

  @ApiPropertyOptional({ example: '09:00' })
  @IsOptional()
  @IsString()
  availableFrom?: string;

  @ApiPropertyOptional({ example: '17:00' })
  @IsOptional()
  @IsString()
  availableTo?: string;

  @ApiProperty({ description: 'User ID for the doctor' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Hospital ID' })
  @IsUUID()
  hospitalId: string;

  @ApiProperty({ description: 'Department ID' })
  @IsUUID()
  departmentId: string;
}
