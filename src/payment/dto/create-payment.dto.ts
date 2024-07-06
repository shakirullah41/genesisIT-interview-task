import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsUrl } from 'class-validator';
import { PaymentMethod } from '../enum/payment-method.enum';

export class CreatePaymentDto {
  @ApiProperty({ description: 'User ID associated with the payment' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Booking ID associated with the payment' })
  @IsNotEmpty()
  @IsNumber()
  bookingId: number;

  @ApiProperty({ description: 'Amount of the payment' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Payment method', enum: PaymentMethod })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  receiptUrl?: string;
}
