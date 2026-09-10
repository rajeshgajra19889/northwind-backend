import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from '../suppliers/supplier.entity.js';
import { SupplierController } from './supplier.controller.js';
import { SupplierService } from './supplier.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([Supplier])],
    controllers: [SupplierController],
    providers: [SupplierService],
    exports: [SupplierService]
})

export class SupplierModule { }