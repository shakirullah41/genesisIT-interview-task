import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { clearDatabase } from './utils/clear-database';
import { TransformInterceptor } from '../src/helpers/interceptors/transform.interceptor';
import { createUserAndLogin } from './utils/test-utils';
import { CreateWalletDto } from '../src/wallet/dto/create-wallet.dto';
import { UpdateWalletDto } from '../src/wallet/dto/update-wallet.dto';
import { WalletType } from '../src/wallet/entities/wallet.entity';

describe('WalletController (e2e)', () => {
  let app: INestApplication;
  let userToken: string;
  let dataSource: DataSource;
  let createdWalletId: number;
  let userId: number;

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
    await clearDatabase(dataSource, ['User', 'Wallet']);
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
  });

  afterAll(async () => {
    await clearDatabase(dataSource, ['User', 'Wallet']);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    await app.close();
  });

  it('/wallet (POST)', async () => {
    const createWalletDto: CreateWalletDto = {
      userId: userId,
      type: WalletType.CRYPTO,
      balance: 100.0,
    };

    const response = await request(app.getHttpServer())
      .post('/api/wallet')
      .set('Authorization', `Bearer ${userToken}`)
      .send(createWalletDto)
      .expect(201);

    createdWalletId = response.body.id;

    expect(response.body).toEqual({
      id: expect.any(Number),
      userId: createWalletDto.userId,
      type: createWalletDto.type,
      balance: createWalletDto.balance,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/wallet (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/wallet')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.items).toBeInstanceOf(Array);
    expect(response.body.total).toBeGreaterThanOrEqual(0);
  });

  it('/wallet/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/wallet/${createdWalletId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body).toEqual({
      id: createdWalletId,
      userId: expect.any(Number),
      type: WalletType.CRYPTO,
      balance: 100.0,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/wallet/:id (PUT)', async () => {
    const updateWalletDto: UpdateWalletDto = {
      balance: 150.0,
    };

    const response = await request(app.getHttpServer())
      .put(`/api/wallet/${createdWalletId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(updateWalletDto)
      .expect(200);

    expect(response.body).toEqual({
      id: createdWalletId,
      userId: expect.any(Number),
      type: WalletType.CRYPTO,
      balance: updateWalletDto.balance,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/wallet/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/api/wallet/${createdWalletId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/api/wallet/${createdWalletId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(404);
  });
});
