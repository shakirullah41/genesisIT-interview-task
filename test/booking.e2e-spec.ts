import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { clearDatabase } from './utils/clear-database';
import { TransformInterceptor } from '../src/helpers/interceptors/transform.interceptor';
import { createUserAndLogin } from './utils/test-utils';
import { CreateBookingDto } from '../src/booking/dto/create-booking.dto';
import { PaymentMethod } from '../src/payment/enum/payment-method.enum';
import { BookingStatus } from '../src/booking/enum/booking-status.enum';

describe('BookingController (e2e)', () => {
  let app: INestApplication;
  let userToken: string;
  let dataSource: DataSource;
  let createdBookingId: number;
  let userId: number;
  let serviceId: number;
  let merchantId: number;

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
    await clearDatabase(dataSource, ['User', 'Booking', 'Merchant', 'Service']);
    userToken = await createUserAndLogin(app);

    // Create a user and get the user ID
    const userResponse = await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({
        name: 'testuser',
        email: 'testuser@example.com',
        phone: '+92313933229',
        password: 'StrongP@ssword1',
      });
    userId = userResponse.body.id;

    // Create a merchant and get the merchant ID
    const merchantResponse = await request(app.getHttpServer())
      .post('/api/merchant')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Test Merchant',
        qrCodeUrl: 'https://example.com/qrcode',
      });
    merchantId = merchantResponse.body.id;

    // Create a service and get the service ID
    const serviceResponse = await request(app.getHttpServer())
      .post('/api/service')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Test Service',
        price: 50.0,
        merchantId: merchantId,
        latitude: 40.712776,
        longitude: -74.005974,
      });
    serviceId = serviceResponse.body.id;
  });

  afterAll(async () => {
    await clearDatabase(dataSource, ['User', 'Booking', 'Merchant', 'Service']);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    await app.close();
  });

  it('/booking (POST)', async () => {
    const createBookingDto: CreateBookingDto = {
      userId: userId,
      serviceId: serviceId,
      merchantId: merchantId,
      bookingDate: new Date(),
    };

    const response = await request(app.getHttpServer())
      .post('/api/booking')
      .set('Authorization', `Bearer ${userToken}`)
      .send(createBookingDto)
      .expect(201);

    createdBookingId = response.body.id;

    expect(response.body).toEqual({
      id: expect.any(Number),
      userId: createBookingDto.userId,
      serviceId: createBookingDto.serviceId,
      merchantId: createBookingDto.merchantId,
      bookingDate: createBookingDto.bookingDate.toISOString(),
      status: expect.any(String),
      paymentStatus: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/booking (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/booking')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.items).toBeInstanceOf(Array);
    expect(response.body.total).toBeGreaterThanOrEqual(0);
  });

  it('/booking/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/booking/${createdBookingId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body).toEqual({
      id: createdBookingId,
      userId: expect.any(Number),
      serviceId: expect.any(Number),
      merchantId: expect.any(Number),
      bookingDate: expect.any(String),
      status: expect.any(String),
      paymentStatus: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/booking/:id/complete (PATCH)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/booking/${createdBookingId}/complete`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body).toEqual({
      id: createdBookingId,
      userId: expect.any(Number),
      serviceId: expect.any(Number),
      merchantId: expect.any(Number),
      bookingDate: expect.any(String),
      status: BookingStatus.COMPLETED,
      paymentStatus: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/booking/:id/pay (PATCH)', async () => {
    const bookingPaymentDto = {
      amount: 100.0,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      creditCardId: 1,
      receiptUrl: 'https://example.com/receipt.pdf',
    };

    const response = await request(app.getHttpServer())
      .patch(`/api/booking/${createdBookingId}/pay`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(bookingPaymentDto)
      .expect(200);

    expect(response.body).toEqual({
      id: createdBookingId,
      userId: expect.any(Number),
      serviceId: expect.any(Number),
      merchantId: expect.any(Number),
      bookingDate: expect.any(String),
      status: expect.any(String),
      paymentStatus: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});
