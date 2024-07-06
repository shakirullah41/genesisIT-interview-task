import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'The name of the service',
    example: 'Premium Car Wash',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The price of the service',
    example: 25.99,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'The ID of the merchant offering the service',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  merchantId: number;

  @ApiProperty({
    description: 'Latitude of the service location',
    example: 40.712776,
  })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'Longitude of the service location',
    example: -74.005974,
  })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}
