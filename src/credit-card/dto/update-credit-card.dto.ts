// dto/update-credit-card.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateCreditCardDto {
  @ApiProperty({
    description: 'Credit card number',
    example: '4111111111111111',
    required: false,
  })
  @IsOptional()
  @IsString()
  cardNumber?: string;

  @ApiProperty({
    description: 'Card holder name',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  cardHolderName?: string;

  @ApiProperty({
    description: 'Expiry date in MM/YY format',
    example: '12/24',
    required: false,
  })
  @IsOptional()
  @IsString()
  expiryDate?: string;

  @ApiProperty({
    description: 'CVV number',
    example: '123',
    required: false,
  })
  @IsOptional()
  @IsString()
  cvv?: string;
}
