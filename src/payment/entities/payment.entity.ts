// entities/payment.entity.ts
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
import { Booking } from '../../booking/entities/booking.entity';
import { User } from '../../user/entities/user.entity';
import { PaymentMethod } from '../enum/payment-method.enum';
import { PaymentStatus } from '../../booking/enum/payment-status.enum';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @Column()
  userId: number;

  @OneToOne(() => Booking, (booking) => booking.payment)
  @JoinColumn()
  booking: Booking;

  @Column()
  bookingId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @Column({ nullable: true })
  receiptUrl: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
