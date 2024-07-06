import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
  IsMobilePhone,
  IsBoolean,
  IsOptional,
  IsInt,
  IsAlpha,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

export class OauthSignUpDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email: string;
}
