import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { Review } from '../../review/entities/review.entity';
import { Service } from '../../service/entities/service.entity';

@Entity()
export class Merchant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ nullable: true })
  qrCodeUrl: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(() => Service, (service) => service.merchant)
  services: Service[];

  @OneToMany(() => Booking, (booking) => booking.merchant)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.merchant)
  reviews: Review[];
}
