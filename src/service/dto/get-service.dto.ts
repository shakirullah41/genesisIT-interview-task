import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class GetServiceDto {
  @ApiProperty({
    description: 'The name of the service to filter by',
    example: 'Premium Car Wash',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The ID of the merchant offering the service',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  merchantId?: number;

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

  @ApiProperty({
    description: 'Latitude of the current location',
    example: 40.712776,
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  latitude?: number;

  @ApiProperty({
    description: 'Longitude of the current location',
    example: -74.005974,
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  longitude?: number;
}
