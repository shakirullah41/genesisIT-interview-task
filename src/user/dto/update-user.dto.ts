import {
  IsString,
  IsEmail,
  IsArray,
  IsOptional,
  IsInt,
  IsMobilePhone,
  Matches,
  MaxLength,
  MinLength,
  IsAlpha,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak.',
  })
  password: string;
}
