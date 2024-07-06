import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource, ILike } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletRepository extends Repository<Wallet> {
  constructor(private dataSource: DataSource) {
    super(Wallet, dataSource.createEntityManager());
  }
  async getWalletById(id: number): Promise<Wallet> {
    const query: any = {
      where: { id },
    };
    const found = await this.findOne(query);
    if (!found) {
      throw new NotFoundException(`Wallet with ID "${id}" not found`);
    }
    return found;
  }
  async getWallets(user: User): Promise<{ items: Wallet[]; total: number }> {
    const query: any = {
      where: { userId: user.id },
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
  async createWallet(
    user: User,
    createWalletDto: CreateWalletDto
  ): Promise<Wallet> {
    const { type, balance } = createWalletDto;

    const wallet = new Wallet();
    wallet.userId = user.id;
    wallet.type = type;
    wallet.balance = balance;
    try {
      await this.save(wallet);
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
    return wallet;
  }
  async updateWallet(id, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    try {
      const wallet = await this.getWalletById(id);
      if (!wallet) {
        throw new NotFoundException(`wallet with ID "${id}" not found`);
      }
      const { balance } = updateWalletDto;
      wallet.balance = balance;

      await this.save(wallet);
      return wallet;
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

  async deleteWallet(id: number): Promise<void> {
    try {
      const Wallet = await this.getWalletById(id);
      await this.remove(Wallet);
    } catch (e) {
      if ('23503') {
        throw new ConflictException(
          'Wallet associated with other entities, can not be deleted'
        );
      }
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
