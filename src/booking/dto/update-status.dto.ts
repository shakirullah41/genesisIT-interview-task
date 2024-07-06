import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '../enum/booking-status.enum';
import { PaymentStatus } from '../enum/payment-status.enum';

export class UpdateStatusDto {
  @ApiProperty({
    description: 'Status of the booking',
    enum: BookingStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiProperty({
    description: 'Status of the booking',
    enum: BookingStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}
