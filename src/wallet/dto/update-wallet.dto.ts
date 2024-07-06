// dto/update-wallet.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateWalletDto {
  @ApiProperty({
    description: 'Balance of the wallet',
    example: 150.00,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  balance?: number;
}
