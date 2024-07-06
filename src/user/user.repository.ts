import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, ILike, Repository } from 'typeorm';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from '../auth/dto/signup.dto';
import { GetUserDto } from './dto/get-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    // type promise bcz it is an asyn method
    const { name, phone, email, password } = signUpDto;
    const user = new User();
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    if (await this.findOne({ where: { email } })) {
      throw new ConflictException('Email already exist!');
    }
    try {
      await user.save();
    } catch (e) {
      if (['23505', '23503', '23502', '23514'].includes(e.code)) {
        throw new ConflictException(e.detail);
      } else {
        throw new InternalServerErrorException(e);
      }
    }
    delete user.password;
    delete user.salt;
    return user;
  }
  async getUsers(
    getUserDto: GetUserDto
  ): Promise<{ total: number; items: User[] }> {
    const {
      email,
      phone,
      page,
      pageSize,
    } = getUserDto;
    const pageOffset = (page - 1) * pageSize;
    // createQueryBuilder is builin method to create query builder that interacts with task table bcz its task repository
    // and the paramenter 'task' is an alias or keyword that refer to the task entity
    const query = this.createQueryBuilder('User');
    if (email) {
      query.andWhere('(User.email ILIKE :email)', { email: `${email}%` });
    }
    if (phone) {
      query.andWhere('(User.phone= :phone)', {
        phone,
      });
    }
    const [items, total] = await query
      .orderBy('User.createdAt', 'DESC')
      .skip(pageOffset)
      .take(pageSize)
      .getManyAndCount();
    return { total, items };
  }
  async updateUser(
    user,
    updateUserDto: UpdateUserDto,
    loggedInUser: User
  ): Promise<User> {
    const { firstname, lastname, email, phone, password } = updateUserDto;
    user.firstname = firstname;
    user.lastname = lastname;
    user.phone = phone;
    // user.roleId = roleId;
    if (password && loggedInUser.email === 'super@emrbilling.com') {
      user.salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, user.salt);
    }
    if (email) {
      user.email = email;
    }
    try {
      await user.save();
    } catch (e) {
      console.log(e);
      if (['23505', '23503', '23502', '23514'].includes(e.code)) {
        throw new ConflictException(e.detail);
      } else {
        throw new InternalServerErrorException(e);
      }
    }
    return user;
  }
  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<User> {
    const { email, password } = authCredentialsDto;
    let where: any = { email: ILike(email) };
    const user = await this.findOne({ where });
    if (user && (await user.validatePassword(password))) {
      return user;
    } else {
      return null;
    }
  }
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async resetPassword(user, resetPasswordDto: ResetPasswordDto): Promise<User> {
    const { password, oldPassword } = resetPasswordDto;

    const isValid = await user.validatePassword(oldPassword);
    if (!isValid) {
      throw new UnauthorizedException('Incorrect old password');
    }
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);

    try {
      await user.save();
    } catch (e) {
      if (['23505', '23503', '23502', '23514'].includes(e.code)) {
        throw new ConflictException(e.detail);
      } else {
        throw new InternalServerErrorException(e);
      }
    }
    return user;
  }
}
