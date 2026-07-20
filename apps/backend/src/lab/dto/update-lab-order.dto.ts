import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LabOrderStatus } from '@/common/enums';

export class UpdateLabOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  testName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  testType?: string;

  @ApiPropertyOptional({ enum: LabOrderStatus })
  @IsOptional()
  @IsEnum(LabOrderStatus)
  status?: LabOrderStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clinicalNotes?: string;
}
