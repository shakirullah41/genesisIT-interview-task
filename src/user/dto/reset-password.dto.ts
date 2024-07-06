import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The new password for the user',
    example: 'StrongP@ssword1',
    required: true,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak.',
  })
  password: string;

  @ApiProperty({
    description: 'The old password of the user',
    example: 'OldP@ssword1',
    required: true,
  })
  @IsString()
  oldPassword: string;
}
