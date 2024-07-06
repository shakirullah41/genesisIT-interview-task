import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource, ILike } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentRepository extends Repository<Payment> {
  constructor(private dataSource: DataSource) {
    super(Payment, dataSource.createEntityManager());
  }
  async getPaymentById(id: number): Promise<Payment> {
    const query: any = {
      where: { id },
    };
    const found = await this.findOne(query);
    if (!found) {
      throw new NotFoundException(`Payment with ID "${id}" not found`);
    }
    return found;
  }
  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { userId, bookingId, amount, method, receiptUrl } = createPaymentDto;

    const payment = new Payment();
    payment.userId = userId;
    payment.bookingId = bookingId;
    payment.amount = amount;
    payment.method = method;
    payment.receiptUrl = receiptUrl;
    try {
      await this.save(payment);
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
    return payment;
  }
}
