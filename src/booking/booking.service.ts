import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { GetBookingDto } from './dto/get-booking.dto';
import { BookingRepository } from './booking.repository';
import { BookingPaymentDto } from './dto/booking-payment.dto';
import { CreatePaymentDto } from '../payment/dto/create-payment.dto';
import { PaymentService } from '../payment/payment.service';
import { UpdateStatusDto } from './dto/update-status.dto';
import { BookingStatus } from './enum/booking-status.enum';
import { PaymentStatus } from './enum/payment-status.enum';
import { User } from '../user/entities/user.entity';

@Injectable()
export class BookingService {
  constructor(
    private BookingRepository: BookingRepository,
    private paymentService: PaymentService
  ) {}

  getBookings(
    user: User,
    getBookingDto: GetBookingDto
  ): Promise<{ items: Booking[]; total: number }> {
    return this.BookingRepository.getBookings(user, getBookingDto);
  }
  getBookingById(id: number): Promise<Booking> {
    return this.BookingRepository.getBookingById(id);
  }
  createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
    return this.BookingRepository.createBooking(createBookingDto);
  }
  markAsComplete(id: number): Promise<Booking> {
    const updateStatusDto: UpdateStatusDto = {
      status: BookingStatus.COMPLETED,
    };
    return this.BookingRepository.updateStatus(id, updateStatusDto);
  }
  async bookingPayment(id: number, bookingPaymentDto: BookingPaymentDto) {
    const { amount, receiptUrl, paymentMethod, walletId, creditCardId } =
      bookingPaymentDto;
    const { userId, status } = await this.BookingRepository.getBookingById(id);
    if (status !== BookingStatus.COMPLETED) {
      throw new BadRequestException(
        'Booking is not marked completed by Merchant'
      );
    }
    //add payment entry with receipt
    const createPaymentDto: CreatePaymentDto = {
      userId,
      bookingId: id,
      receiptUrl,
      method: paymentMethod,
      amount,
    };
    await this.paymentService.createPayment(createPaymentDto);

    // NOTE: we have credit card id and wallet id on the basis of we can do transactions.
    // if(paymentMethod === PaymentMethod.Credit_Card) then use creditCardId to pay 
    // if(paymentMethod !== PaymentMethod.Credit_Card) then use wallet to pay
    // and user ACID transaction with lock machanism for smooth payment without intreption
    
    try {
      const updateStatusDto: UpdateStatusDto = {
        paymentStatus: PaymentStatus.PAID,
      };
      return this.BookingRepository.updateStatus(id, updateStatusDto);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException({
        error: 'Something went wrong, please try again later.',
      });
    }
  }
}
