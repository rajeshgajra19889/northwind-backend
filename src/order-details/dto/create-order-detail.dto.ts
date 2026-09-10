import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateOrderDetailDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  productId: number;

  @IsOptional()
  @IsNumber()
  unitPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  discount?: number;
}