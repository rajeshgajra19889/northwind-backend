import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { OrderDetailService } from './order-detail.service.js';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto.js';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto.js';

@Controller('order-details')
export class OrderDetailController {
    constructor(private readonly orderDetailService: OrderDetailService) { }

    @Get()
    getOrderDetails(
        @Query('search') search?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: string,
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
        @Query('orderId') orderId?: string,
    ) {
        return this.orderDetailService.getOrderDetails(
            search || '',
            sortBy || 'orderId',
            sortOrder || 'ASC',
            parseInt(page || '1', 10),
            parseInt(pageSize || '10', 10),
            orderId ? parseInt(orderId, 10) : undefined,
        );
    }

    @Get(':orderId/:productId')
    async getOrderDetailById(
        @Param('orderId', ParseIntPipe) orderId: number,
        @Param('productId', ParseIntPipe) productId: number,
    ) {
        const detail = await this.orderDetailService.getOrderDetailById(orderId, productId);
        if (!detail) {
            throw new NotFoundException(`Order detail ${orderId}/${productId} not found`);
        }
        return detail;
    }

    @Post()
    async createOrderDetail(@Body() dto: CreateOrderDetailDto) {
        return this.orderDetailService.createOrderDetail(dto);
    }

    @Patch(':orderId/:productId')
    async updateOrderDetail(
        @Param('orderId', ParseIntPipe) orderId: number,
        @Param('productId', ParseIntPipe) productId: number,
        @Body() dto: UpdateOrderDetailDto,
    ) {
        const detail = await this.orderDetailService.getOrderDetailById(orderId, productId);
        if (!detail) {
            throw new NotFoundException(`Order detail ${orderId}/${productId} not found`);
        }
        return this.orderDetailService.updateOrderDetail(orderId, productId, dto);
    }

    @Delete(':orderId/:productId')
    async deleteOrderDetail(
        @Param('orderId', ParseIntPipe) orderId: number,
        @Param('productId', ParseIntPipe) productId: number,
    ) {
        const detail = await this.orderDetailService.getOrderDetailById(orderId, productId);
        if (!detail) {
            throw new NotFoundException(`Order detail ${orderId}/${productId} not found`);
        }
        await this.orderDetailService.deleteOrderDetail(orderId, productId);
        return { message: `Order detail ${orderId}/${productId} deleted` };
    }
}