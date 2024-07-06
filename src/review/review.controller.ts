import { Body, Controller, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entities/review.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('review')
@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  async createReview(
    @Body() createReviewDto: CreateReviewDto
  ): Promise<Review> {
    return this.reviewService.createReview(createReviewDto);
  }
}
