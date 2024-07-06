// entities/review.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { Merchant } from '../../merchant/entities/merchant.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Merchant, (merchant) => merchant.reviews)
  merchant: Merchant;

  @Column()
  merchantId: number;

  @OneToOne(() => Booking, (booking) => booking.review)
  booking: Booking;

  @Column()
  bookingId: number;

  @Column()
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
