import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource, ILike } from 'typeorm';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { Merchant } from './entities/merchant.entity';
import { GetMerchantDto } from './dto/get-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

@Injectable()
export class MerchantRepository extends Repository<Merchant> {
 constructor(private dataSource: DataSource) {
    super(Merchant, dataSource.createEntityManager());
  }
  async getMerchantById(id: number): Promise<Merchant> {
    const query: any = {
      where: { id },
    };
    const found = await this.findOne(query);
    if (!found) {
      throw new NotFoundException(`Merchant with ID "${id}" not found`);
    }
    return found;
  }
  async getMerchants(
    getMerchantDto: GetMerchantDto
  ): Promise<{ items: Merchant[]; total: number }> {
    const { name, page, pageSize } = getMerchantDto;
    const pageOffset = (page - 1) * pageSize;
    const where: any = {};

    if (name) {
      where.name = ILike(name);
    }
    const query: any = {
      where,
      skip: pageOffset,
      take: pageSize,
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
  async createMerchant(
    createMerchantDto: CreateMerchantDto
  ): Promise<Merchant> {
    const { name, qrCodeUrl } = createMerchantDto;

    const merchant = new Merchant();
    merchant.name = name;
    merchant.qrCodeUrl = qrCodeUrl;
    try {
      await this.save(merchant);
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
    return merchant;
  }
  async updateMerchant(
    id,
    updateMerchantDto: UpdateMerchantDto
  ): Promise<Merchant> {
    try {
      const merchant = await this.getMerchantById(id);
      if (!merchant) {
        throw new NotFoundException(`Merchant with ID "${id}" not found`);
      }
      const { name, qrCodeUrl } = updateMerchantDto;
      merchant.name = name;
      merchant.qrCodeUrl = qrCodeUrl;

      await this.save(merchant);
      return merchant;
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

  async deleteMerchant(id: number): Promise<void> {
    try {
      const merchant = await this.getMerchantById(id);
      await this.remove(merchant);
    } catch (e) {
      if ('23503') {
        throw new ConflictException(
          'Merchant associated with other entities, can not be deleted'
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
