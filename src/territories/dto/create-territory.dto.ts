import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateTerritoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  territoryId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  territoryDescription: string;

  @IsNumber()
  regionId: number;
}