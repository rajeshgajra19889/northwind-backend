import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  categoryName: string;

  @IsOptional()
  @IsString()
  description?: string;
}