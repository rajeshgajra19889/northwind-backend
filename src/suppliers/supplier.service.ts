import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './supplier.entity.js';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class SupplierService {
    constructor(
        @InjectRepository(Supplier)
        private readonly supplierRepo: Repository<Supplier>,
        @InjectDataSource() private readonly dataSource: DataSource,
    ) { }

    async getSuppliers(): Promise<Supplier[]> {
        return this.supplierRepo.find({
            order: { companyName: 'ASC' },
        });
    }

    async getSupplierList(
        search: string,
        sortBy: string,
        sortOrder: string,
        page: number,
        pageSize: number,
    ) {
        const offSet = (page - 1) * pageSize;
        const qb = this.supplierRepo.createQueryBuilder('supplier');

        if (search) {
            qb.where(
                'supplier.companyName ILIKE :search OR supplier.contactName ILIKE :search OR supplier.city ILIKE :search OR supplier.country ILIKE :search',
                { search: `%${search}%` },
            );
        }

        const sortMap: Record<string, string> = {
            supplierId: 'supplier.supplierId',
            companyName: 'supplier.companyName',
            contactName: 'supplier.contactName',
            city: 'supplier.city',
            country: 'supplier.country',
            phone: 'supplier.phone',
        };
        const orderBy = sortMap[sortBy] ?? 'supplier.companyName';
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

    async getSupplierById(id: number): Promise<Supplier | null> {
        return this.supplierRepo.findOneBy({ supplierId: id });
    }

    async createSupplier(data: Partial<Supplier>): Promise<Supplier> {
        const [{ nextId }] = await this.dataSource.query(
            `SELECT COALESCE(MAX(supplier_id), 0) + 1 AS "nextId" FROM suppliers`,
        );
        return this.supplierRepo.save(this.supplierRepo.create({ ...data, supplierId: nextId }));
    }

    async updateSupplier(id: number, data: Partial<Supplier>): Promise<Supplier | null> {
        await this.supplierRepo.update({ supplierId: id }, data);
        return this.getSupplierById(id);
    }

    async deleteSupplier(id: number): Promise<boolean> {
        try {
            const result = await this.supplierRepo.delete({ supplierId: id });
            return (result.affected ?? 0) > 0;
        } catch (error: any) {
            if (error.code === '23503' || error.errno === 1451) {
                throw new BadRequestException(
                    'Cannot delete supplier because it is linked to existing products.',
                );
            }
            throw error;
        }
    }
}