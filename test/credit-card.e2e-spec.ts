import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateCreditCardDto } from '../src/credit-card/dto/create-credit-card.dto';
import { UpdateCreditCardDto } from '../src/credit-card/dto/update-credit-card.dto';
import { DataSource } from 'typeorm';
import { clearDatabase } from './utils/clear-database';
import { TransformInterceptor } from '../src/helpers/interceptors/transform.interceptor';
import { createUserAndLogin } from './utils/test-utils';

describe('CreditCardController (e2e)', () => {
  let app: INestApplication;
  let userToken: string;
  let createdCardId: number;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      })
    );
    // );
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await clearDatabase(dataSource, ['User', 'CreditCard']);
  });

  beforeEach(async () => {
    await clearDatabase(dataSource, ['User']);
    userToken = await createUserAndLogin(app);
  });

  afterAll(async () => {
    await clearDatabase(dataSource, ['User', 'CreditCard']);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    await app.close();
  });

  it('/api/credit-card (POST)', async () => {
    const createCreditCardDto: CreateCreditCardDto = {
      cardNumber: '4111111111111111',
      cardHolderName: 'John Doe',
      expiryDate: '12/24',
      cvv: '123',
    };

    const response = await request(app.getHttpServer())
      .post('/api/credit-card')
      .set('Authorization', `Bearer ${userToken}`)
      .send(createCreditCardDto)
      .expect(201);

    createdCardId = response.body.id;

    expect(response.body).toEqual({
      id: expect.any(Number),
      userId: expect.any(Number),
      cardNumber: createCreditCardDto.cardNumber,
      cardHolderName: createCreditCardDto.cardHolderName,
      expiryDate: createCreditCardDto.expiryDate,
      cvv: createCreditCardDto.cvv,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/api/credit-card (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/credit-card')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.items).toBeInstanceOf(Array);
    expect(response.body.total).toBeGreaterThanOrEqual(0);
  });

  it('/api/credit-card/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/credit-card/${createdCardId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body).toEqual({
      id: createdCardId,
      userId: expect.any(Number),
      cardNumber: '4111111111111111',
      cardHolderName: 'John Doe',
      expiryDate: '12/24',
      cvv: '123',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/api/credit-card/:id (PUT)', async () => {
    const updateCreditCardDto: UpdateCreditCardDto = {
      cardNumber: '4111111111111112',
      cardHolderName: 'Jane Doe',
      expiryDate: '11/25',
      cvv: '456',
    };

    const response = await request(app.getHttpServer())
      .put(`/api/credit-card/${createdCardId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(updateCreditCardDto)
      .expect(200);

    expect(response.body).toEqual({
      id: createdCardId,
      userId: expect.any(Number),
      cardNumber: updateCreditCardDto.cardNumber,
      cardHolderName: updateCreditCardDto.cardHolderName,
      expiryDate: updateCreditCardDto.expiryDate,
      cvv: updateCreditCardDto.cvv,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/api/credit-card/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/api/credit-card/${createdCardId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/api/credit-card/${createdCardId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(404);
  });
});
function morgan(arg0: string): any {
  throw new Error('Function not implemented.');
}
