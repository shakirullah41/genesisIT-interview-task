import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILike } from 'typeorm';
import { UserService } from '../../user/user.service';
import { User } from '../../user/entities/user.entity';

@Injectable() // to make it injectable so other modules can use it
export class JwtPassportStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      // super used to call the constructor of base/parent class
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // used to extract token from req header automatically
      secretOrKey: configService.get('JWT_SECRET'), //config
    });
  }
  // this function is must and at this point token is already verified.
  async validate(payload): Promise<User> {
    const { email } = payload;
    let where: any = { email: ILike(email) };
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
