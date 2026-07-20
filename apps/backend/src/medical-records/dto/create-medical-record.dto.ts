import { IsUUID, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMedicalRecordDto {
  @ApiProperty({ example: 'Type 2 Diabetes Mellitus' })
  @IsString()
  diagnosis: string;

  @ApiPropertyOptional({ example: 'Frequent urination, increased thirst' })
  @IsOptional()
  @IsString()
  symptoms?: string;

  @ApiPropertyOptional({ example: 'Metformin 500mg twice daily' })
  @IsOptional()
  @IsString()
  treatment?: string;

  @ApiPropertyOptional({ example: 'Follow up in 3 months' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'blood-report.pdf' })
  @IsOptional()
  @IsString()
  attachments?: string;

  @ApiProperty({ description: 'Patient ID' })
  @IsUUID()
  patientId: string;

  @ApiProperty({ description: 'Doctor ID' })
  @IsUUID()
  doctorId: string;
}
