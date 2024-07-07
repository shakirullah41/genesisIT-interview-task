import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { clearDatabase } from './utils/clear-database';
import { TransformInterceptor } from '../src/helpers/interceptors/transform.interceptor';
import { createUserAndLogin } from './utils/test-utils';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { CreateServiceDto } from '../src/service/dto/create-service.dto';

describe('ReviewController (e2e)', () => {
  let app: INestApplication;
  let userToken: string;
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
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    await clearDatabase(dataSource, ['User', 'Review', 'Merchant', 'Booking']);
    userToken = await createUserAndLogin(app);
  });

  afterAll(async () => {
    await clearDatabase(dataSource, ['User', 'Review', 'Merchant', 'Booking']);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    await app.close();
  });

  it('/review (POST)', async () => {
    let userId: number;
    let merchantId: number;
    let bookingId: number;
    let serviceId: number;

    // Create a user
    const userResponse = await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({
        name: 'testuser',
        email: 'testusers@example.com',
        phone: '+92313933229',
        password: 'StrongP@ssword1',
      });
    userId = userResponse.body.id;

    // Create a merchant
    const merchantResponse = await request(app.getHttpServer())
      .post('/api/merchant')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Test Merchant',
        qrCodeUrl: 'https://example.com/qrcode',
      });
    merchantId = merchantResponse.body.id;

    const createServiceDto: CreateServiceDto = {
      name: 'Premium Car Wash',
      price: 25.99,
      merchantId: merchantId,
      latitude: 40.712776,
      longitude: -74.005974,
    };
    const serviceResponse = await request(app.getHttpServer())
      .post('/api/service')
      .set('Authorization', `Bearer ${userToken}`)
      .send(createServiceDto);
    serviceId = serviceResponse.body.id;

    // Create a booking
    const bookingResponse = await request(app.getHttpServer())
      .post('/api/booking')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        userId,
        serviceId,
        merchantId,
        bookingDate: new Date().toISOString(),
      });
    bookingId = bookingResponse.body.id;

    const createReviewDto: CreateReviewDto = {
      userId,
      merchantId,
      bookingId,
      rating: 5,
      comment: 'Excellent service!',
    };
    const response = await request(app.getHttpServer())
      .post('/api/review')
      .set('Authorization', `Bearer ${userToken}`)
      .send(createReviewDto);
    //   .expect(201);

    expect(response.body).toEqual({
      id: expect.any(Number),
      userId: createReviewDto.userId,
      merchantId: createReviewDto.merchantId,
      bookingId: createReviewDto.bookingId,
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});
