import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource, ILike } from 'typeorm';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { CreditCard } from './entities/credit-card.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CreditCardRepository extends Repository<CreditCard> {
  constructor(private dataSource: DataSource) {
    super(CreditCard, dataSource.createEntityManager());
  }
  async getCreditCardById(id: number): Promise<CreditCard> {
    const query: any = {
      where: { id },
    };
    const found = await this.findOne(query);
    if (!found) {
      throw new NotFoundException(`CreditCard with ID "${id}" not found`);
    }
    return found;
  }
  async getCreditCards(
    user: User
  ): Promise<{ items: CreditCard[]; total: number }> {
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
  async createCreditCard(
    user: User,
    createCreditCardDto: CreateCreditCardDto
  ): Promise<CreditCard> {
    const { cardNumber, cardHolderName, expiryDate, cvv } = createCreditCardDto;

    const creditCard = new CreditCard();
    creditCard.userId = user.id;
    creditCard.cardNumber = cardNumber;
    creditCard.cardHolderName = cardHolderName;
    creditCard.expiryDate = expiryDate;
    creditCard.cvv = cvv;
    try {
      await this.save(creditCard);
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
    return creditCard;
  }
  async updateCreditCard(
    id,
    updateCreditCardDto: UpdateCreditCardDto
  ): Promise<CreditCard> {
    try {
      const creditCard = await this.getCreditCardById(id);
      if (!CreditCard) {
        throw new NotFoundException(`CreditCard with ID "${id}" not found`);
      }
      const { cardNumber, cardHolderName, expiryDate, cvv } =
        updateCreditCardDto;
      creditCard.cardNumber = cardNumber;
      creditCard.cardHolderName = cardHolderName;
      creditCard.expiryDate = expiryDate;
      creditCard.cvv = cvv;

      await this.save(creditCard);
      return creditCard;
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

  async deleteCreditCard(id: number): Promise<void> {
    try {
      const CreditCard = await this.getCreditCardById(id);
      await this.remove(CreditCard);
    } catch (e) {
      if ('23503') {
        throw new ConflictException(
          'Credit Card associated with other entities, can not be deleted'
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
