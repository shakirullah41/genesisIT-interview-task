import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource, ILike } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewRepository extends Repository<Review> {
  constructor(private dataSource: DataSource) {
    super(Review, dataSource.createEntityManager());
  }
  async getReviewById(id: number): Promise<Review> {
    const query: any = {
      where: { id },
    };
    const found = await this.findOne(query);
    if (!found) {
      throw new NotFoundException(`Review with ID "${id}" not found`);
    }
    return found;
  }
  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const { userId, merchantId, bookingId, rating, comment } = createReviewDto;

    const review = new Review();
    review.userId = userId;
    review.merchantId = merchantId;
    review.bookingId = bookingId;
    review.rating = rating;
    review.comment = comment;
    try {
      await this.save(review);
    } catch (e) {
      console.log(e);
      if (['23505', '23503', '23502', '23514'].includes(e.code)) {
        throw new ConflictException(e.detail);
      } else {
        throw new InternalServerErrorException({
          error: 'Something went wrong, please try again later.',
        });
      }
    }
    return review;
  }
}
