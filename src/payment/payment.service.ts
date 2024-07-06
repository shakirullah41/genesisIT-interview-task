import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentRepository } from './payment.repository';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(private paymentRepository: PaymentRepository) {}
  createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentRepository.createPayment(createPaymentDto);
  }
}
