import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { clearDatabase } from './utils/clear-database';
import { TransformInterceptor } from '../src/helpers/interceptors/transform.interceptor';
import { createUserAndLogin } from './utils/test-utils';
import { CreateServiceDto } from '../src/service/dto/create-service.dto';
import { UpdateServiceDto } from '../src/service/dto/update-service.dto';

describe('ServiceController (e2e)', () => {
  let app: INestApplication;
  let userToken: string;
  let dataSource: DataSource;
  let createdServiceId: number;
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
    await clearDatabase(dataSource, ['User', 'Service', 'Merchant']);
    userToken = await createUserAndLogin(app);

    // Create a merchant
    const merchantResponse = await request(app.getHttpServer())
      .post('/api/merchant')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Test 2 Merchant',
        qrCodeUrl: 'https://example.com/qrcode',
      });
    merchantId = merchantResponse.body.id;
  });

  afterAll(async () => {
    await clearDatabase(dataSource, ['User', 'Service', 'Merchant']);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    await app.close();
  });

  it('/service (POST)', async () => {
    const createServiceDto: CreateServiceDto = {
      name: 'Premium Car Wash',
      price: 25.99,
      merchantId: merchantId,
      latitude: 40.712776,
      longitude: -74.005974,
    };

    const response = await request(app.getHttpServer())
      .post('/api/service')
      .set('Authorization', `Bearer ${userToken}`)
      .send(createServiceDto)
      .expect(201);

    createdServiceId = response.body.id;

    expect(response.body).toEqual({
      id: expect.any(Number),
      name: createServiceDto.name,
      price: createServiceDto.price,
      merchantId: createServiceDto.merchantId,
      latitude: createServiceDto.latitude,
      longitude: createServiceDto.longitude,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/service (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/service')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.items).toBeInstanceOf(Array);
    expect(response.body.total).toBeGreaterThanOrEqual(0);
  });

  it('/service/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/service/${createdServiceId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body).toEqual({
      id: createdServiceId,
      name: 'Premium Car Wash',
      price: 25.99,
      merchantId: merchantId,
      latitude: 40.712776,
      longitude: -74.005974,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/service/:id (PUT)', async () => {
    const updateServiceDto: UpdateServiceDto = {
      name: 'Luxury Car Wash',
      price: 30.99,
      merchantId: merchantId,
      latitude: 40.712776,
      longitude: -74.005974,
    };

    const response = await request(app.getHttpServer())
      .put(`/api/service/${createdServiceId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(updateServiceDto)
      .expect(200);

    expect(response.body).toEqual({
      id: createdServiceId,
      name: updateServiceDto.name,
      price: updateServiceDto.price,
      merchantId: updateServiceDto.merchantId,
      latitude: updateServiceDto.latitude,
      longitude: updateServiceDto.longitude,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/service/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/api/service/${createdServiceId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/api/service/${createdServiceId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(404);
  });
});
