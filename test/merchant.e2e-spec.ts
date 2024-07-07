import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { clearDatabase } from './utils/clear-database';
import { TransformInterceptor } from '../src/helpers/interceptors/transform.interceptor';
import { createUserAndLogin } from './utils/test-utils';

describe('MerchantController (e2e)', () => {
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
    // await clearDatabase(dataSource, ['Merchant']);
  });

  beforeEach(async () => {
    await clearDatabase(dataSource, ['User']);
    userToken = await createUserAndLogin(app);
  });

  afterAll(async () => {
    await clearDatabase(dataSource, ['Merchant']);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    await app.close();
  });

  it('/merchant (POST)', async () => {
    const createMerchantDto = {
      name: 'Acme Corp',
      qrCodeUrl: 'https://example.com/qr-code.png',
    };

    const response = await request(app.getHttpServer())
      .post('/api/merchant')
      .set('Authorization', `Bearer ${userToken}`)
      .send(createMerchantDto)
      .expect(201);

    expect(response.body).toEqual({
      id: expect.any(Number),
      name: createMerchantDto.name,
      qrCodeUrl: createMerchantDto.qrCodeUrl,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/merchant (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/merchant')
      .set('Authorization', `Bearer ${userToken}`)
      .query({ name: 'Acme Corp', page: 1, pageSize: 10 })
      .expect(200);

    expect(response.body.items).toBeInstanceOf(Array);
    expect(response.body.items.length).toBeGreaterThanOrEqual(0);
    expect(response.body.total).toBeGreaterThanOrEqual(0);
  });

  it('/merchant/:id (GET)', async () => {
    const createMerchantDto = {
      name: 'Acme Corp',
      qrCodeUrl: 'https://example.com/qr-code.png',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/api/merchant')
      .set('Authorization', `Bearer ${userToken}`)
      .send(createMerchantDto)
      .expect(201);

    const { id } = createResponse.body;

    const response = await request(app.getHttpServer())
      .get(`/api/merchant/${id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body).toEqual({
      id: expect.any(Number),
      name: createMerchantDto.name,
      qrCodeUrl: createMerchantDto.qrCodeUrl,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/merchant/:id (PUT)', async () => {
    const createMerchantDto = {
      name: 'Acme Corp',
      qrCodeUrl: 'https://example.com/qr-code.png',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/api/merchant')
      .set('Authorization', `Bearer ${userToken}`)
      .send(createMerchantDto)
      .expect(201);

    const { id } = createResponse.body;

    const updateMerchantDto = {
      name: 'Updated Acme Corp',
      qrCodeUrl: 'https://example.com/updated-qr-code.png',
    };

    const response = await request(app.getHttpServer())
      .put(`/api/merchant/${id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(updateMerchantDto)
      .expect(200);

    expect(response.body).toEqual({
      id,
      name: updateMerchantDto.name,
      qrCodeUrl: updateMerchantDto.qrCodeUrl,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/merchant/:id (DELETE)', async () => {
    const createMerchantDto = {
      name: 'Acme Corp',
      qrCodeUrl: 'https://example.com/qr-code.png',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/api/merchant')
      .set('Authorization', `Bearer ${userToken}`)
      .send(createMerchantDto)
      .expect(201);

    const { id } = createResponse.body;

    await request(app.getHttpServer())
      .delete(`/api/merchant/${id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/api/merchant/${id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(404);
  });
});
