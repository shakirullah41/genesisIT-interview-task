import { Injectable } from '@nestjs/common';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { CreditCard } from './entities/credit-card.entity';
import { CreditCardRepository } from './credit-card.repository';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CreditCardService {
  constructor(private creditCardRepository: CreditCardRepository) {}

  getCreditCards(user: User): Promise<{ items: CreditCard[]; total: number }> {
    return this.creditCardRepository.getCreditCards(user);
  }
  getCreditCardById(id: number): Promise<CreditCard> {
    return this.creditCardRepository.getCreditCardById(id);
  }
  createCreditCard(
    user: User,
    createCreditCardDto: CreateCreditCardDto
  ): Promise<CreditCard> {
    return this.creditCardRepository.createCreditCard(
      user,
      createCreditCardDto
    );
  }
  updateCreditCard(
    id: number,
    updateCreditCardDto: UpdateCreditCardDto
  ): Promise<CreditCard> {
    return this.creditCardRepository.updateCreditCard(id, updateCreditCardDto);
  }
  deleteCreditCard(id: number): Promise<void> {
    return this.creditCardRepository.deleteCreditCard(id);
  }
}
