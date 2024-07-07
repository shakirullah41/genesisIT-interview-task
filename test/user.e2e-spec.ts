import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { clearDatabase } from './utils/clear-database';
import { TransformInterceptor } from '../src/helpers/interceptors/transform.interceptor';
import { createUserAndLogin } from './utils/test-utils';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userToken: string;
  let dataSource: DataSource;
  let createdUserId: number;

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
    await clearDatabase(dataSource, ['User']);
    userToken = await createUserAndLogin(app);
  });

  afterAll(async () => {
    await clearDatabase(dataSource, ['User']);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    await app.close();
  });

  it('/user (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/user')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.items).toBeInstanceOf(Array);
    expect(response.body.total).toBeGreaterThanOrEqual(0);
  });

  it('/user/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/user/${createdUserId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body).toEqual({
      id: createdUserId,
      firstname: expect.any(String),
      lastname: expect.any(String),
      email: expect.any(String),
      phone: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/user/:id (PUT)', async () => {
    const updateUserDto = {
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'janedoe@example.com',
      phone: '+1234567890',
    };

    const response = await request(app.getHttpServer())
      .put(`/api/user/${createdUserId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(updateUserDto)
      .expect(200);

    expect(response.body).toEqual({
      id: createdUserId,
      firstname: updateUserDto.firstname,
      lastname: updateUserDto.lastname,
      email: updateUserDto.email,
      phone: updateUserDto.phone,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/user/:id/reset-password (PATCH)', async () => {
    const resetPasswordDto = {
      password: 'NewStrongP@ssword1',
      oldPassword: 'StrongP@ssword1',
    };

    await request(app.getHttpServer())
      .patch(`/api/user/${createdUserId}/reset-password`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(resetPasswordDto)
      .expect(200);
  });
});
