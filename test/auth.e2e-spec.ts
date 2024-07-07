import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { clearDatabase } from './utils/clear-database';
import { TransformInterceptor } from '../src/helpers/interceptors/transform.interceptor';

describe('Auth Controller (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalInterceptors(new TransformInterceptor());
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await clearDatabase(dataSource, ['User']);
    await app.init();
  });
  afterAll(async () => {
    await clearDatabase(dataSource, ['User']);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    await app.close();
  });
  describe('Authentication', () => {
    let userToken: string;
    const signUpDto = {
      name: 'testuser',
      email: 'testuser@example.com',
      phone: '+92313933229',
      password: 'StrongP@ssword1',
    };

    it('/auth/signup (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/signup')
        .send(signUpDto)
        .expect(201);

      expect(response.body).toEqual({
        id: expect.any(Number),
        name: signUpDto.name,
        email: signUpDto.email,
        phone: signUpDto.phone,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('/auth/login (POST)', async () => {
      const loginDto = {
        email: 'testuser@example.com',
        password: 'StrongP@ssword1',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toEqual({
        accessToken: expect.any(String),
      });

      userToken = response.body.accessToken;
    });

    it('/auth/profile (GET)', async () => {
      const profileResponse = await request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(profileResponse.body).toEqual({
        id: expect.any(Number),
        name: signUpDto.name,
        email: signUpDto.email,
        phone: signUpDto.phone,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});
