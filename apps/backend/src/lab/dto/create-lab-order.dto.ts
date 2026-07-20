import { IsUUID, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLabOrderDto {
  @ApiProperty({ example: 'Complete Blood Count' })
  @IsString()
  testName: string;

  @ApiPropertyOptional({ example: 'Hematology' })
  @IsOptional()
  @IsString()
  testType?: string;

  @ApiPropertyOptional({ example: 'URGENT', enum: ['NORMAL', 'URGENT', 'STAT'] })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ example: 'Patient presents with fatigue' })
  @IsOptional()
  @IsString()
  clinicalNotes?: string;

  @ApiProperty({ description: 'Patient ID' })
  @IsUUID()
  patientId: string;

  @ApiProperty({ description: 'Hospital ID' })
  @IsUUID()
  hospitalId: string;
}
