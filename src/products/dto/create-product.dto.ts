import { IsNotEmpty, IsOptional, IsNumber, IsString, MaxLength } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateProductDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  productName: string;

  @IsOptional()
  @IsNumber()
  supplierId?: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  quantityPerUnit?: string;

  @IsOptional()
  @IsNumber()
  unitPrice?: number;

  @IsOptional()
  @IsNumber()
  unitsInStock?: number;

  @IsOptional()
  @IsNumber()
  unitsOnOrder?: number;

  @IsOptional()
  @IsNumber()
  reorderLevel?: number;

  @IsNumber()
  discontinued: number;
}