import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';
import { GetBookingDto } from './dto/get-booking.dto';
import { BookingStatus } from './enum/booking-status.enum';
import { BookingPaymentDto } from './dto/booking-payment.dto';
import { User } from '../user/entities/user.entity';
import { GetUser } from '../auth/decorator/get-user.decorator';

@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  getBookings(
    @Query(ValidationPipe) getBookingDto: GetBookingDto,
    @GetUser() user: User
  ): Promise<{ items: Booking[]; total: number }> {
    return this.bookingService.getBookings(user, getBookingDto);
  }

  @Get(':id')
  async getBooking(@Param('id', ParseIntPipe) id: number): Promise<Booking> {
    return this.bookingService.getBookingById(id);
  }

  @Post()
  async createBooking(
    @Body() createBookingDto: CreateBookingDto
  ): Promise<Booking> {
    return this.bookingService.createBooking(createBookingDto);
  }

  @Patch(':id/complete')
  completeBooking(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.markAsComplete(id);
  }

  @Patch(':id/pay')
  async bookingPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) bookingPaymentDto: BookingPaymentDto
  ) {
    return this.bookingService.bookingPayment(id, bookingPaymentDto);
  }
}
