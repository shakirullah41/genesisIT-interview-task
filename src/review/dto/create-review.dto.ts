import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'User ID associated with the review' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Merchant ID associated with the review' })
  @IsNotEmpty()
  @IsNumber()
  merchantId: number;

  @ApiProperty({ description: 'Booking ID associated with the review' })
  @IsNotEmpty()
  @IsNumber()
  bookingId: number;

  @ApiProperty({ description: 'Rating of the review', minimum: 1, maximum: 5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Comment for the review' })
  @IsNotEmpty()
  @IsString()
  comment: string;
}
