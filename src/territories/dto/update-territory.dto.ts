import { PartialType } from '@nestjs/mapped-types';
import { CreateTerritoryDto } from './create-territory.dto.js';

export class UpdateTerritoryDto extends PartialType(CreateTerritoryDto) {}