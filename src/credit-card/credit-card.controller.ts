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
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { CreditCard } from './entities/credit-card.entity';
import { CreditCardService } from './credit-card.service';

@ApiTags('CreditCard')
@Controller('credit-card')
export class CreditCardController {
  constructor(private creditCardService: CreditCardService) {}

  @Get()
  getCreditCards(
    @GetUser() user: User
  ): Promise<{ items: CreditCard[]; total: number }> {
    return this.creditCardService.getCreditCards(user);
  }
  @Get('/:id')
  getCreditCardById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<CreditCard> {
    return this.creditCardService.getCreditCardById(id);
  }
  @Post()
  createCreditCard(
    @Body(ValidationPipe) createCreditCardDto: CreateCreditCardDto,
    @GetUser() user: User
  ): Promise<CreditCard> {
    return this.creditCardService.createCreditCard(user, createCreditCardDto);
  }

  @Put('/:id')
  updateCreditCard(
    @Body(ValidationPipe) updateCreditCardDto: UpdateCreditCardDto,
    @Param('id', ParseIntPipe) id: number
  ): Promise<CreditCard> {
    return this.creditCardService.updateCreditCard(id, updateCreditCardDto);
  }

  @Delete('/:id')
  deleteCreditCard(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.creditCardService.deleteCreditCard(id);
  }
}
