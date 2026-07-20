import { IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddLabResultDto {
  @ApiProperty({ example: { hemoglobin: '12.5 g/dL', wbc: '7000/μL', platelets: '250000/μL' } })
  @IsObject()
  result: Record<string, any>;

  @ApiPropertyOptional({ example: 'Values within normal range' })
  @IsOptional()
  @IsString()
  notes?: string;
}
