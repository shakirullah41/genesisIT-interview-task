import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

export const createUserAndLogin = async (app: INestApplication) => {
  const signUpDto = {
    name: 'testuser',
    email: 'testuser@example.com',
    phone: '+92313933229',
    password: 'StrongP@ssword1',
  };

  // Create a user
  const signUpResponse = await request(app.getHttpServer())
    .post('/api/auth/signup')
    .send(signUpDto);
  expect([201, 409]).toContain(signUpResponse.status);

  // Log in the user
  const loginDto = {
    email: 'testuser@example.com',
    password: 'StrongP@ssword1',
  };
  const loginResponse = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send(loginDto)
    .expect(200);

  return loginResponse.body.accessToken;
};
