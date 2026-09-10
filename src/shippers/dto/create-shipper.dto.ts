import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateShipperDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  companyName: string;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  phone?: string;
}