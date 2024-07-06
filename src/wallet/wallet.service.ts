import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { WalletRepository } from './wallet.repository';

@Injectable()
export class WalletService {
  constructor(private walletRepository: WalletRepository) {}

  getWallets(user: User): Promise<{ items: Wallet[]; total: number }> {
    return this.walletRepository.getWallets(user);
  }
  getWalletById(id: number): Promise<Wallet> {
    return this.walletRepository.getWalletById(id);
  }
  createWallet(user: User, createWalletDto: CreateWalletDto): Promise<Wallet> {
    return this.walletRepository.createWallet(user, createWalletDto);
  }
  updateWallet(id: number, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    return this.walletRepository.updateWallet(id, updateWalletDto);
  }
  deleteWallet(id: number): Promise<void> {
    return this.walletRepository.deleteWallet(id);
  }
}
