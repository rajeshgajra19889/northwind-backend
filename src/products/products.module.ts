import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity.js';
import { ProductController } from './product.controller.js';
import { ProductService } from './product.service.js';
import { Supplier } from '../suppliers/supplier.entity.js';
import { Category } from '../categories/category.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([Product,Supplier,Category])],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService]
})

export class ProductModule { }