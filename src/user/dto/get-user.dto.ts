import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class GetUserDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNotEmpty()
  page?: number = 1;

  @IsOptional()
  @IsNotEmpty()
  pageSize?: number = 10;
}
