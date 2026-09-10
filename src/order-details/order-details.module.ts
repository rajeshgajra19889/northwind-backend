import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from './order-detail.entity.js';
import { OrderDetailController } from './order-detail.controller.js';
import { OrderDetailService } from './order-detail.service.js';
import { Order } from '../orders/order.entity.js';
import { Product } from '../products/product.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([OrderDetail, Order, Product])],
    controllers: [OrderDetailController],
    providers: [OrderDetailService],
})

export class OrderDetailModule { }