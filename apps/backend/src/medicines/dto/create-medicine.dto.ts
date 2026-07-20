import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MedicineCategory } from '@/common/enums';

export class CreateMedicineDto {
  @ApiProperty({ example: 'Metformin 500mg' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Metformin Hydrochloride' })
  @IsOptional()
  @IsString()
  genericName?: string;

  @ApiPropertyOptional({ enum: MedicineCategory, default: MedicineCategory.OTHER })
  @IsOptional()
  @IsEnum(MedicineCategory)
  category?: MedicineCategory;

  @ApiPropertyOptional({ example: 'Sun Pharma' })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiProperty({ example: 45.5 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: 'tablet' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ example: 'Oral diabetes medication' })
  @IsOptional()
  @IsString()
  description?: string;
}
