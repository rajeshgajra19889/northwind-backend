import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  titleOfCourtesy?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @IsOptional()
  @IsDateString()
  hireDate?: Date;

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
  homePhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4)
  extension?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  reportsTo?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  photoPath?: string;
}
