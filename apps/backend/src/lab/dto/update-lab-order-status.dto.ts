import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LabOrderStatus } from '@/common/enums';

export class UpdateLabOrderStatusDto {
  @ApiProperty({ enum: LabOrderStatus })
  @IsEnum(LabOrderStatus)
  status: LabOrderStatus;
}
