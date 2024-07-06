import { Module } from '@nestjs/common';
import { CreditCardService } from './credit-card.service';
import { CreditCardController } from './credit-card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditCard } from './entities/credit-card.entity';
import { CreditCardRepository } from './credit-card.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CreditCard])],
  controllers: [CreditCardController],
  providers: [CreditCardService, CreditCardRepository],
})
export class CreditCardModule {}
