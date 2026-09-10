import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from './region.entity.js';
import { RegionController } from './region.controller.js';
import { RegionService } from './region.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([Region])],
    controllers: [RegionController],
    providers: [RegionService],
    exports: [RegionService]
})

export class RegionModule { }