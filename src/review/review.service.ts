import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(private reviewRepository: ReviewRepository) {}

  createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewRepository.createReview(createReviewDto);
  }
}
