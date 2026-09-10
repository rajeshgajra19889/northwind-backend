import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Territory } from './territory.entity.js';
import { TerritoryController } from './territory.controller.js';
import { TerritoryService } from './territory.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([Territory])],
    controllers: [TerritoryController],
    providers: [TerritoryService],
    exports: [TerritoryService]
})

export class TerritoryModule { }