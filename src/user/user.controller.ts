import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { GetUserDto } from './dto/get-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserIsUserGuard } from './extras/userIsUser.guard';
import { User } from './user.entity';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers(
    @Query(ValidationPipe) getUserDto: GetUserDto
  ): Promise<{ total: number; items: User[] }> {
    return this.userService.getUsers(getUserDto);
  }

  @Get('/:id')
  getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Put('/:id')
  updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @Param('id') id: number,
    @GetUser() user: User
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto, user);
  }

  @Patch('/:id/reset-password')
  @UseGuards(UserIsUserGuard)
  resetPassword(
    @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto,
    @Param('id') id: number
  ): Promise<void> {
    return this.userService.resetPassword(id, resetPasswordDto);
  }
}
