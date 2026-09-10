import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Get()
    getOrders(
        @Query('search') search?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: string,
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
        @Query('employeeId') employeeId?: string,
        @Query('customerId') customerId?: string,
    ) {
        return this.orderService.getOrders(
            search || '',
            sortBy || 'orderId',
            sortOrder || 'ASC',
            parseInt(page || '1', 10),
            parseInt(pageSize || '10', 10),
            employeeId ? parseInt(employeeId, 10) : undefined,
            customerId || undefined,
        );
    }

    @Get(':id')
    async getOrderById(@Param('id', ParseIntPipe) id: number) {
        const order = await this.orderService.getOrderById(id);
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }

    @Post()
    async createOrder(@Body() dto: CreateOrderDto) {
        return this.orderService.createOrder(dto);
    }

    @Patch(':id')
    async updateOrder(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderDto) {
        const order = await this.orderService.getOrderById(id);
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }
        return this.orderService.updateOrder(id, dto);
    }

    @Delete(':id')
    async deleteOrder(@Param('id', ParseIntPipe) id: number) {
        const order = await this.orderService.getOrderById(id);
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }
        await this.orderService.deleteOrder(id);
        return { message: `Order ${id} deleted` };
    }
}