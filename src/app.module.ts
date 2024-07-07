import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configValidationSchema } from '../config.schema';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt.guard';
import { MerchantModule } from './merchant/merchant.module';
import { ServiceModule } from './service/service.module';
import { BookingModule } from './booking/booking.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewModule } from './review/review.module';
import { CreditCardModule } from './credit-card/credit-card.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      [process.env.STAGE !== 'prod' ? 'envFilePath' : 'ignoreEnvFile']:
        process.env.STAGE !== 'local' ? ['.env'] : true,
      validationSchema: configValidationSchema,
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod';
        const isTest = configService.get('STAGE') === 'test';
        return {
          ssl: isProduction,
          type: 'postgres',
          entities: [__dirname + '/../**/*.entity.{js,ts}'],
          synchronize: false,
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: isTest
            ? configService.get('DB_TEST_DATABASE_NAME')
            : configService.get('DB_DATABASE_NAME'),
          logging: true,
        };
      },
    }),
    AuthModule,
    MerchantModule,
    ServiceModule,
    BookingModule,
    PaymentModule,
    ReviewModule,
    CreditCardModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
