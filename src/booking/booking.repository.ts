import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource, ILike } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { GetBookingDto } from './dto/get-booking.dto';
import { PaymentStatus } from './enum/payment-status.enum';
import { BookingStatus } from './enum/booking-status.enum';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class BookingRepository extends Repository<Booking> {
  constructor(private dataSource: DataSource) {
    super(Booking, dataSource.createEntityManager());
  }
  async getBookingById(id: number): Promise<Booking> {
    const query: any = {
      where: { id },
    };
    const found = await this.findOne(query);
    if (!found) {
      throw new NotFoundException(`Booking with ID "${id}" not found`);
    }
    return found;
  }
  async getBookings(
    user,
    getBookingDto: GetBookingDto
  ): Promise<{ items: Booking[]; total: number }> {
    const { merchantId, serviceId, status, paymentStatus, page, pageSize } =
      getBookingDto;
    const pageOffset = (page - 1) * pageSize;
    const where: any = { userId: user.id };

    if (merchantId) {
      where.merchantId = merchantId;
    }
    if (serviceId) {
      where.serviceId = serviceId;
    }
    if (status) {
      where.status = status;
    }
    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }
    const query: any = {
      where,
      skip: pageOffset,
      take: pageSize,
      order: { createdAt: 'DESC' },
    };
    try {
      const [items, total] = await this.findAndCount(query);
      return { total, items };
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
  }
  async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { userId, serviceId, merchantId, bookingDate } = createBookingDto;

    const booking = new Booking();
    booking.userId = userId;
    booking.serviceId = serviceId;
    booking.merchantId = merchantId;
    booking.bookingDate = bookingDate;
    try {
      await this.save(booking);
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
    return booking;
  }
  async updateStatus(id, updateStatusDto: UpdateStatusDto): Promise<Booking> {
    const booking = await this.getBookingById(id);
    if (!Booking) {
      throw new NotFoundException(`Booking with ID "${id}" not found`);
    }
    const { status, paymentStatus } = updateStatusDto;
    if (status && booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        'Only bookings with status "PENDING" can be updated.'
      );
    }
    if (paymentStatus && booking.paymentStatus !== PaymentStatus.UNPAID) {
      throw new BadRequestException(
        'Only payment with status "UNPAID" can be updated.'
      );
    }
    try {
      if (status) {
        booking.status = status;
      }
      if (paymentStatus) {
        booking.paymentStatus = paymentStatus;
      }
      await this.save(booking);
      return booking;
    } catch (e) {
      if (['23505', '23503', '23502', '23514'].includes(e.code)) {
        throw new ConflictException(e.detail);
      } else {
        console.log(e);
        throw new InternalServerErrorException({
          error: 'Something went wrong, please try again later.',
        });
      }
    }
  }
}
