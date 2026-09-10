import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  @MaxLength(5)
  customerId?: string;

  @IsOptional()
  @IsNumber()
  employeeId?: number;

  @IsOptional()
  @IsDateString()
  orderDate?: string;

  @IsOptional()
  @IsDateString()
  requiredDate?: string;

  @IsOptional()
  @IsDateString()
  shippedDate?: string;

  @IsOptional()
  @IsNumber()
  shipVia?: number;

  @IsOptional()
  @IsNumber()
  freight?: number;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  shipName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  shipAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  shipCity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  shipRegion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  shipPostalCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  shipCountry?: string;
}