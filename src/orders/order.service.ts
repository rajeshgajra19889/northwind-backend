import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './order.entity.js';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,
        @InjectDataSource() private readonly dataSource: DataSource,
    ) { }

    async getOrders(
        search: string,
        sortBy: string,
        sortOrder: string,
        page: number,
        pageSize: number,
        employeeId?: number,
        customerId?: string,
    ) {
        const offSet = (page - 1) * pageSize;
        const qb = this.orderRepo.createQueryBuilder('order')
            .leftJoinAndSelect('order.customer', 'customer')
            .leftJoinAndSelect('order.employee', 'employee');

        if (customerId) {
            qb.where('order.customerId = :customerId', { customerId });
            if (search) {
                qb.andWhere(
                    'order.shipCity ILIKE :search OR CAST(order.orderId AS TEXT) ILIKE :search',
                    { search: `%${search}%` },
                );
            }
        } else if (employeeId) {
            qb.where('order.employeeId = :employeeId', { employeeId });
            if (search) {
                qb.andWhere(
                    'customer.companyName ILIKE :search OR order.shipCity ILIKE :search OR CAST(order.orderId AS TEXT) ILIKE :search',
                    { search: `%${search}%` },
                );
            }
        } else if (search) {
            qb.where(
                'customer.companyName ILIKE :search OR employee.lastName ILIKE :search OR employee.firstName ILIKE :search OR order.shipCity ILIKE :search OR CAST(order.orderId AS TEXT) ILIKE :search',
                { search: `%${search}%` },
            );
        }

        const sortMap: Record<string, string> = {
            orderId: 'order.orderId',
            customerName: 'customer.companyName',
            employeeName: 'employee.lastName',
            orderDate: 'order.orderDate',
            freight: 'order.freight',
            shipCity: 'order.shipCity',
            shipCountry: 'order.shipCountry',
        };
        const orderBy = sortMap[sortBy] ?? 'order.orderId';
        qb.orderBy(orderBy, sortOrder === 'desc' ? 'DESC' : 'ASC');

        const total = await qb.getCount();
        const rows = await qb.skip(offSet).take(pageSize).getMany();

        const data = rows.map((order) => ({
            orderId: order.orderId,
            customerId: order.customerId,
            employeeId: order.employeeId,
            orderDate: order.orderDate,
            requiredDate: order.requiredDate,
            shippedDate: order.shippedDate,
            shipVia: order.shipVia,
            freight: order.freight,
            shipName: order.shipName,
            shipAddress: order.shipAddress,
            shipCity: order.shipCity,
            shipRegion: order.shipRegion,
            shipPostalCode: order.shipPostalCode,
            shipCountry: order.shipCountry,
            customerName: order.customer?.companyName ?? null,
            employeeName: order.employee
                ? `${order.employee.firstName} ${order.employee.lastName}`
                : null,
        }));

        return { data, total, totalPages: Math.ceil(total / pageSize), page, pageSize };
    }

    async getOrderById(id: number): Promise<Order | null> {
        return this.orderRepo.findOne({
            where: { orderId: id },
            relations: { customer: true, employee: true },
        });
    }

    async createOrder(data: Partial<Order>): Promise<Order> {
        const [{ nextId }] = await this.dataSource.query(
            `SELECT COALESCE(MAX(order_id), 0) + 1 AS "nextId" FROM orders`,
        );
        return this.orderRepo.save(this.orderRepo.create({ ...data, orderId: nextId }));
    }

    async updateOrder(id: number, data: Partial<Order>): Promise<Order | null> {
        await this.orderRepo.update({ orderId: id }, data);
        return this.getOrderById(id);
    }

    async deleteOrder(id: number): Promise<boolean> {
        try {
            const result = await this.orderRepo.delete({ orderId: id });
            return (result.affected ?? 0) > 0;
        } catch (error: any) {
            if (error.code === '23503' || error.errno === 1451) {
                throw new Error('Cannot delete order because it is linked to existing order details.');
            }
            throw error;
        }
    }
}