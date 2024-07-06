import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class CreateMerchantDto {
  @ApiProperty({
    description: 'The name of the merchant',
    example: 'Acme Corp',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The URL of the QR code for the merchant',
    example: 'https://example.com/qr-code.png',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  qrCodeUrl?: string;
}
