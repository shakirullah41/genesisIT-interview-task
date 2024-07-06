import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class GetMerchantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  page?: number = 1;

  @IsOptional()
  @IsNotEmpty()
  pageSize?: number = 10;
}
