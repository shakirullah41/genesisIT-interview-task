import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignUpDto } from './dto/signup.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async login(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    try {
      const user =
        await this.userService.validateUserPassword(authCredentialsDto);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const { id, email } = user;
      const accessToken = await this.generateToken({ id, email });
      return { accessToken };
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException({
        error: 'Something went wrong, please try again later.',
      });
    }
  }
  async signUp(signUpDto: SignUpDto): Promise<User> {
    return this.userService.signUp(signUpDto);
  }
  async generateToken(data) {
    try {
      const payload = { ...data };
      const accessToken = await this.jwtService.sign(payload);
      return accessToken;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException({
        error: 'Something went wrong, please try again later.',
      });
    }
  }
}
