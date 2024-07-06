import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { BookingRepository } from './booking.repository';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [PaymentModule, TypeOrmModule.forFeature([Booking])],
  providers: [BookingService, BookingRepository],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}
