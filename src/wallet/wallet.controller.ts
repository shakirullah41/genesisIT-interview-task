import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';

@ApiTags('Wallet')
@Controller('Wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  getWallets(
    @GetUser() user: User
  ): Promise<{ items: Wallet[]; total: number }> {
    return this.walletService.getWallets(user);
  }
  @Get('/:id')
  getWalletById(@Param('id', ParseIntPipe) id: number): Promise<Wallet> {
    return this.walletService.getWalletById(id);
  }
  @Post()
  createWallet(
    @Body(ValidationPipe) createWalletDto: CreateWalletDto,
    @GetUser() user: User
  ): Promise<Wallet> {
    return this.walletService.createWallet(user, createWalletDto);
  }

  @Put('/:id')
  updateWallet(
    @Body(ValidationPipe) updateWalletDto: UpdateWalletDto,
    @Param('id', ParseIntPipe) id: number
  ): Promise<Wallet> {
    return this.walletService.updateWallet(id, updateWalletDto);
  }

  @Delete('/:id')
  deleteWallet(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.walletService.deleteWallet(id);
  }
}
