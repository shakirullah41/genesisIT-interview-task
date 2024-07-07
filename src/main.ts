import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import { TransformInterceptor } from './helpers/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.use(
    morgan(
      ':remote-addr :user-agent - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'
    )
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  // swagger setup
  const config = new DocumentBuilder()
    .setTitle('Api Documentation')
    .setDescription('Banking Mobile Application API')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'accessToken'
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  // cors whitelisting
  let whitelist = ['http://localhost:3000'];
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });
  await app.listen(3000);
}
bootstrap();
