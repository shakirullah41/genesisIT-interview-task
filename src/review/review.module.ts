import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewRepository } from './review.repository';
import { ReviewController } from './review.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  providers: [ReviewService, ReviewRepository],
  controllers: [ReviewController],
})
export class ReviewModule {}
