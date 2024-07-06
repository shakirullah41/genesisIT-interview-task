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
import { MerchantService } from './merchant.service';
import { Public } from '../auth/decorator/public.decorator';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { GetMerchantDto } from './dto/get-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { Merchant } from './entities/merchant.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('merchant')
@Controller('merchant')
export class MerchantController {
  constructor(private merchantService: MerchantService) {}

  @Get()
  getMerchants(
    @Query(ValidationPipe) getMerchantDto: GetMerchantDto
  ): Promise<{ items: Merchant[]; total: number }> {
    return this.merchantService.getMerchants(getMerchantDto);
  }
  @Get('/:id')
  getMerchantById(@Param('id', ParseIntPipe) id: number): Promise<Merchant> {
    return this.merchantService.getMerchantById(id);
  }
  @Post()
  createMerchant(
    @Body(ValidationPipe) createMerchantDto: CreateMerchantDto
  ): Promise<Merchant> {
    return this.merchantService.createMerchant(createMerchantDto);
  }

  @Put('/:id')
  updateMerchant(
    @Body(ValidationPipe) updateMerchantDto: UpdateMerchantDto,
    @Param('id', ParseIntPipe) id: number
  ): Promise<Merchant> {
    return this.merchantService.updateMerchant(id, updateMerchantDto);
  }

  @Delete('/:id')
  deleteMerchant(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.merchantService.deleteMerchant(id);
  }
}
