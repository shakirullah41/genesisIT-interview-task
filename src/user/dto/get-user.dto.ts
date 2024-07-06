import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class GetUserDto {
  @ApiProperty({
    description: 'The email of the user to filter by',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'The phone number of the user to filter by',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'The page number for pagination',
    example: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
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
  pageSize?: number = 10;
}
