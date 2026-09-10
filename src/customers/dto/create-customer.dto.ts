import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  customerId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  companyName: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  contactName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  contactTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  region?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  postalCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  fax?: string;
}