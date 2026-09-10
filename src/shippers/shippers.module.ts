import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipper } from './shipper.entity.js';
import { ShipperController } from './shipper.controller.js';
import { ShipperService } from './shipper.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([Shipper])],
    controllers: [ShipperController],
    providers: [ShipperService],
    exports: [ShipperService]
})

export class ShipperModule { }