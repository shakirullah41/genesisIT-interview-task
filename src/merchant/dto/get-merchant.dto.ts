import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class GetMerchantDto {
  @ApiProperty({
    description: 'The name of the merchant to filter by',
    example: 'Acme Corp',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The page number for pagination',
    example: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'The number of items per page for pagination',
    example: 10,
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number = 10;
}
