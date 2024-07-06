import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsEnum, IsString } from 'class-validator';
import { BookingStatus } from '../enum/booking-status.enum';
import { PaymentStatus } from '../enum/payment-status.enum';
import { Type } from 'class-transformer';

export class GetBookingDto {
  @ApiProperty({ description: 'User ID to filter bookings', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId?: number;

  @ApiProperty({
    description: 'Merchant ID to filter bookings',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  merchantId?: number;

  @ApiProperty({
    description: 'Service ID to filter bookings',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  serviceId?: number;

  @ApiProperty({
    description: 'Status to filter bookings',
    enum: BookingStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiProperty({
    description: 'Payment Status to filter bookings',
    enum: BookingStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({
    description: 'Page size for pagination',
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  pageSize?: number = 10;
}
