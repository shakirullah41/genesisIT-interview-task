import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike } from 'typeorm';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { SignUpDto } from '../auth/dto/signup.dto';
import { GetUserDto } from './dto/get-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUsers(
    getUserDto: GetUserDto,
  ): Promise<{ total: number; items: User[] }> {
    return this.userRepository.getUsers(getUserDto);
  }

  async getUserById(id: number): Promise<User> {
    const found = await this.userRepository.findOne({
      where: { id },
    });
    if (!found) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return found;
  }
  async signUp(signUpDto: SignUpDto): Promise<User> {
    return this.userRepository.signUp(signUpDto);
  }
  async getUserByEmail(email: string, isNotValidate?): Promise<User> {
    const found = await this.userRepository.findOne({
      where: { email: ILike(email) },
    });
    if (!found && !isNotValidate) {
      throw new NotFoundException(`User with EMAIL "${email}" not found`);
    }
    return found;
  }
  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User> {
    return this.userRepository.validateUserPassword(authCredentialsDto);
  }
  async updateUser(
    id,
    updateUserDto: UpdateUserDto,
    loggedInUser: User,
  ): Promise<any> {
    const user = await this.getUserById(id);
    return this.userRepository.updateUser(user, updateUserDto, loggedInUser);
  }

  async resetPassword(
    id,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<any> {
    const user = await this.getUserById(id);
    return this.userRepository.resetPassword(user, resetPasswordDto);
  }
}
