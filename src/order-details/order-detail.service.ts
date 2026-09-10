import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetail } from './order-detail.entity.js';

@Injectable()
export class OrderDetailService {
    constructor(
        @InjectRepository(OrderDetail)
        private readonly orderDetailRepo: Repository<OrderDetail>,
    ) { }

    async getOrderDetails(
        search: string,
        sortBy: string,
        sortOrder: string,
        page: number,
        pageSize: number,
        orderId?: number,
    ) {
        const offSet = (page - 1) * pageSize;
        const qb = this.orderDetailRepo.createQueryBuilder('orderDetail')
            .leftJoinAndSelect('orderDetail.order', 'order')
            .leftJoinAndSelect('orderDetail.product', 'product');

        if (orderId !== undefined) {
            qb.where('orderDetail.orderId = :orderId', { orderId });
        }

        if (search) {
            qb.andWhere(
                'product.productName ILIKE :search OR CAST(orderDetail.productId AS TEXT) ILIKE :search',
                { search: `%${search}%` },
            );
        }

        const sortMap: Record<string, string> = {
            orderId: 'orderDetail.orderId',
            productId: 'orderDetail.productId',
            productName: 'product.productName',
            unitPrice: 'orderDetail.unitPrice',
            quantity: 'orderDetail.quantity',
            discount: 'orderDetail.discount',
        };
        const orderBy = sortMap[sortBy] ?? 'orderDetail.orderId';
        qb.orderBy(orderBy, sortOrder === 'desc' ? 'DESC' : 'ASC');

        const total = await qb.getCount();
        const rows = await qb.skip(offSet).take(pageSize).getMany();

        const data = rows.map((detail) => ({
            orderId: detail.orderId,
            productId: detail.productId,
            unitPrice: detail.unitPrice,
            quantity: detail.quantity,
            discount: detail.discount,
            productName: detail.product?.productName ?? null,
            orderDate: detail.order?.orderDate ?? null,
            lineTotal: (detail.quantity ?? 0) * (detail.unitPrice ?? 0) * (1 - (detail.discount ?? 0)),
        }));

        return { data, total, totalPages: Math.ceil(total / pageSize), page, pageSize };
    }

    async getOrderDetailById(orderId: number, productId: number): Promise<OrderDetail | null> {
        return this.orderDetailRepo.findOne({
            where: { orderId, productId },
            relations: { order: true, product: true },
        });
    }

    async createOrderDetail(data: Partial<OrderDetail>): Promise<OrderDetail> {
        return this.orderDetailRepo.save(this.orderDetailRepo.create(data));
    }

    async updateOrderDetail(
        orderId: number,
        productId: number,
        data: Partial<OrderDetail>,
    ): Promise<OrderDetail | null> {
        await this.orderDetailRepo.update({ orderId, productId }, data);
        return this.getOrderDetailById(orderId, productId);
    }

    async deleteOrderDetail(orderId: number, productId: number): Promise<boolean> {
        const result = await this.orderDetailRepo.delete({ orderId, productId });
        return (result.affected ?? 0) > 0;
    }
}