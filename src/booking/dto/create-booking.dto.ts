import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'User ID associated with the booking' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Service ID associated with the booking' })
  @IsNotEmpty()
  @IsNumber()
  serviceId: number;

  @ApiProperty({ description: 'Merchant ID associated with the booking' })
  @IsNotEmpty()
  @IsNumber()
  merchantId: number;

  @ApiProperty({
    description: 'Date and time of the booking',
    example: '2024-07-21T15:30:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  bookingDate: Date;
}
