import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Cardiology' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Heart and cardiovascular system care' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Dr. Smith' })
  @IsOptional()
  @IsString()
  headOfDept?: string;

  @ApiPropertyOptional({ example: '+91-22-12345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'cardiology@hospital.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Hospital ID' })
  @IsUUID()
  hospitalId: string;
}
