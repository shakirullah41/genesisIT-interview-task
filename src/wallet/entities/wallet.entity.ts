// entities/wallet.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum WalletType {
  CRYPTO = 'crypto',
  SN_BALANCE = 'sn_balance',
  GBP_WALLET = 'gbp_wallet',
}

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: WalletType,
  })
  type: WalletType;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
