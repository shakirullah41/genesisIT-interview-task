import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtPassportStrategy } from './strategy/jwt-passport.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true, // This means that we don't need to import the JwtModule anywhere else in our application
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 3600 * 8,
        },
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtPassportStrategy],
  exports: [AuthService, JwtPassportStrategy],
})
export class AuthModule {}
