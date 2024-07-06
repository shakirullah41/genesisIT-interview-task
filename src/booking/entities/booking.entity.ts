import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Merchant } from '../../merchant/entities/merchant.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { Review } from '../../review/entities/review.entity';
import { Service } from '../../service/entities/service.entity';
import { User } from '../../user/entities/user.entity';
import { BookingStatus } from '../enum/booking-status.enum';
import { PaymentStatus } from '../enum/payment-status.enum';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Service, (service) => service.bookings)
  service: Service;

  @Column()
  serviceId: number;

  @ManyToOne(() => Merchant, (merchant) => merchant.bookings)
  merchant: Merchant;

  @Column()
  merchantId: number;

  @Column()
  bookingDate: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  paymentStatus: PaymentStatus;

  @OneToOne(() => Payment, (payment) => payment.booking)
  @JoinColumn()
  payment: Payment;

  @OneToOne(() => Review, (review) => review.booking)
  @JoinColumn()
  review: Review;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
