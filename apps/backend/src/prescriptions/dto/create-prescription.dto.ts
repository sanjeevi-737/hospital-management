import { IsUUID, IsString, IsOptional, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PrescriptionMedicationDto {
  @ApiProperty({ example: 'Metformin' })
  @IsString()
  medicineName: string;

  @ApiProperty({ example: '500mg' })
  @IsString()
  dosage: string;

  @ApiProperty({ example: 'Twice daily' })
  @IsString()
  frequency: string;

  @ApiProperty({ example: '30 days' })
  @IsString()
  duration: string;

  @ApiPropertyOptional({ example: 'Take with food' })
  @IsOptional()
  @IsString()
  instructions?: string;
}

export class CreatePrescriptionDto {
  @ApiPropertyOptional({ example: 'Continue current medication' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: '2024-06-15' })
  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @ApiProperty({ description: 'Patient ID' })
  @IsUUID()
  patientId: string;

  @ApiProperty({ description: 'Doctor ID' })
  @IsUUID()
  doctorId: string;

  @ApiPropertyOptional({ type: [PrescriptionMedicationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionMedicationDto)
  medications?: PrescriptionMedicationDto[];
}
