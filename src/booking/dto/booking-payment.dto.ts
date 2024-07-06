import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { PaymentMethod } from '../../payment/enum/payment-method.enum';

export class BookingPaymentDto {
  @ApiProperty({ description: 'Amount of the payment' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Payment method', enum: PaymentMethod })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description:
      'ID of the credit card (required if payment method is CREDIT_CARD)',
    example: 1,
  })
  @ValidateIf((o) => !!(o.paymentMethod === PaymentMethod.CREDIT_CARD))
  @IsNumber()
  @IsNotEmpty()
  creditCardId: number;

  @ApiProperty({
    description:
      'ID of the wallet (required if payment method is not CREDIT_CARD)',
    example: 1,
  })
  @ValidateIf((o) => o.paymentMethod !== PaymentMethod.CREDIT_CARD)
  @IsNumber()
  @IsNotEmpty()
  walletId: number;

  @ApiProperty({
    description: 'URL of the payment receipt',
    example: 'https://example.com/receipt.pdf',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  receiptUrl?: string;
}
