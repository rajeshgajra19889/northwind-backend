import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRegionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  regionDescription: string;
}