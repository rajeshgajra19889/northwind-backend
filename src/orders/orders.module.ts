import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity.js';
import { OrderController } from './order.controller.js';
import { OrderService } from './order.service.js';
import { Customer } from '../customers/customer.entity.js';
import { Employee } from '../employees/employee.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Customer, Employee])],
    controllers: [OrderController],
    providers: [OrderService],
})

export class OrderModule { }