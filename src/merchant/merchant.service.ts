import { Injectable } from '@nestjs/common';
import { MerchantRepository } from './merchant.repository';
import { GetMerchantDto } from './dto/get-merchant.dto';
import { Merchant } from './entities/merchant.entity';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

@Injectable()
export class MerchantService {
  constructor(private merchantRepository: MerchantRepository) {}

  getMerchants(
    getMerchantDto: GetMerchantDto
  ): Promise<{ items: Merchant[]; total: number }> {
    return this.merchantRepository.getMerchants(getMerchantDto);
  }
  getMerchantById(id: number): Promise<Merchant> {
    return this.merchantRepository.getMerchantById(id);
  }
  createMerchant(createMerchantDto: CreateMerchantDto): Promise<Merchant> {
    return this.merchantRepository.createMerchant(createMerchantDto);
  }
  updateMerchant(
    id: number,
    updateMerchantDto: UpdateMerchantDto
  ): Promise<Merchant> {
    return this.merchantRepository.updateMerchant(id, updateMerchantDto);
  }
  deleteMerchant(id: number): Promise<void> {
    return this.merchantRepository.deleteMerchant(id);
  }
}
