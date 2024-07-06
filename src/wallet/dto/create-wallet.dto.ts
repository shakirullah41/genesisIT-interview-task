import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { WalletType } from '../entities/wallet.entity';

export class CreateWalletDto {
  @ApiProperty({
    description: 'User ID associated with the wallet',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Type of the wallet',
    example: WalletType.CRYPTO,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(WalletType)
  type: WalletType;

  @ApiProperty({
    description: 'Initial balance of the wallet',
    example: 100.0,
    required: false,
  })
  @IsNumber()
  balance?: number = 0;
}
