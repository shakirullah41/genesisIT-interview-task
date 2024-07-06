import { Module } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { Merchant } from './entities/merchant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantRepository } from './merchant.repository';
import { MerchantController } from './merchant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant])],
  providers: [MerchantService,MerchantRepository],
  controllers: [MerchantController],
})
export class MerchantModule {}
