import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHospitalDto {
  @ApiProperty({ example: 'City General Hospital' })
  @IsString()
  name: string;

  @ApiProperty({ example: '123 Medical Street' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Mumbai' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Maharashtra' })
  @IsString()
  state: string;

  @ApiPropertyOptional({ example: 'India' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: '+91-22-12345678' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'info@citygeneral.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'https://citygeneral.com' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logo?: string;
}
