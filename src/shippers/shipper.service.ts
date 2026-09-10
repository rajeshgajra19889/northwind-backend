import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Shipper } from './shipper.entity.js';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class ShipperService {
    constructor(
        @InjectRepository(Shipper)
        private readonly shipperRepo: Repository<Shipper>,
        @InjectDataSource() private readonly dataSource: DataSource,
    ) { }

    async getShippers(): Promise<Shipper[]> {
        return this.shipperRepo.find({
            order: { companyName: 'ASC' },
        });
    }

    async getShipperList(
        search: string,
        sortBy: string,
        sortOrder: string,
        page: number,
        pageSize: number,
    ) {
        const offSet = (page - 1) * pageSize;
        const qb = this.shipperRepo.createQueryBuilder('shipper');

        if (search) {
            qb.where(
                'shipper.companyName ILIKE :search OR shipper.phone ILIKE :search',
                { search: `%${search}%` },
            );
        }

        const sortMap: Record<string, string> = {
            shipperId: 'shipper.shipperId',
            companyName: 'shipper.companyName',
            phone: 'shipper.phone',
        };
        const orderBy = sortMap[sortBy] ?? 'shipper.companyName';
        qb.orderBy(orderBy, sortOrder === 'desc' ? 'DESC' : 'ASC');

        const total = await qb.getCount();
        const data = await qb.skip(offSet).take(pageSize).getMany();

        return {
            data,
            total,
            totalPages: Math.ceil(total / pageSize),
            page,
            pageSize,
        };
    }

    async getShipperById(id: number): Promise<Shipper | null> {
        return this.shipperRepo.findOneBy({ shipperId: id });
    }

    async createShipper(data: Partial<Shipper>): Promise<Shipper> {
        const [{ nextId }] = await this.dataSource.query(
            `SELECT COALESCE(MAX(shipper_id), 0) + 1 AS "nextId" FROM shippers`,
        );
        return this.shipperRepo.save(this.shipperRepo.create({ ...data, shipperId: nextId }));
    }

    async updateShipper(id: number, data: Partial<Shipper>): Promise<Shipper | null> {
        await this.shipperRepo.update({ shipperId: id }, data);
        return this.getShipperById(id);
    }

    async deleteShipper(id: number): Promise<boolean> {
        try {
            const result = await this.shipperRepo.delete({ shipperId: id });
            return (result.affected ?? 0) > 0;
        } catch (error: any) {
            if (error.code === '23503' || error.errno === 1451) {
                throw new BadRequestException(
                    'Cannot delete shipper because it is referenced by existing orders.',
                );
            }
            throw error;
        }
    }
}