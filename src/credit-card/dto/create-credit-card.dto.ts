// dto/create-credit-card.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCreditCardDto {
  @ApiProperty({
    description: 'Credit card number',
    example: '4111111111111111',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  cardNumber: string;

  @ApiProperty({
    description: 'Card holder name',
    example: 'John Doe',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  cardHolderName: string;

  @ApiProperty({
    description: 'Expiry date in MM/YY format',
    example: '12/24',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  expiryDate: string;

  @ApiProperty({
    description: 'CVV number',
    example: '123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  cvv: string;
}
