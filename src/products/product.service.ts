import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Product } from "./product.entity.js";
import { Repository } from "typeorm/browser";
import { BadRequestException, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm/browser/data-source/index.js";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        @InjectDataSource() private readonly dataSource: DataSource,
    ) { }

    async getProducts(
        search: string,
        sortBy: string,
        sortOrder: string,
        page: number,
        pageSize: number,
        supplierId?: number,
    ) {
        const offSet = (page - 1) * pageSize;
        const qb = this.productRepo.createQueryBuilder('product')
            .leftJoinAndSelect('product.supplier', 'supplier')
            .leftJoinAndSelect('product.category', 'category');

        if (supplierId) {
            qb.where('product.supplierId = :supplierId', { supplierId });
            if (search) {
                qb.andWhere(
                    'product.productName ILIKE :search OR category.categoryName ILIKE :search',
                    { search: `%${search}%` },
                );
            }
        } else if (search) {
            qb.where(
                'product.productName ILIKE :search OR supplier.companyName ILIKE :search OR category.categoryName ILIKE :search',
                { search: `%${search}%` },
            );
        }

        const sortMap: Record<string, string> = {
            productId: 'product.productId',
            productName: 'product.productName',
            supplierName: 'supplier.companyName',
            categoryName: 'category.categoryName',
        };
        const orderBy = sortMap[sortBy] ?? 'product.productName';
        qb.orderBy(orderBy, sortOrder === 'desc' ? 'DESC' : 'ASC');

        const total = await qb.getCount();
        const rows = await qb.skip(offSet).take(pageSize).getMany();

        const data = rows.map((product) => ({
            productId: product.productId,
            productName: product.productName,
            quantityPerUnit: product.quantityPerUnit,
            unitPrice: product.unitPrice,
            unitsInStock: product.unitsInStock,
            unitsOnOrder: product.unitsOnOrder,
            reorderLevel: product.reorderLevel,
            discontinued: product.discontinued,
            supplierId: product.supplierId,
            categoryId: product.categoryId,
            supplierName: product.supplier?.companyName ?? null,
            categoryName: product.category?.categoryName ?? null,
        }));

        return { data, total, totalPages: Math.ceil(total / pageSize), page, pageSize };
    }

    async getProductById(id: number): Promise<Product | null> {
        return this.productRepo.findOneBy({ productId: id });
    }

    async createProduct(data: Partial<Product>): Promise<Product> {
        return this.productRepo.save(this.productRepo.create(data));
    }

    async updateProduct(id: number, data: Partial<Product>): Promise<Product | null> {
        const product = await this.getProductById(id);
        if (!product) {
            return null;
        }
        await this.productRepo.update({ productId: id }, data);
        return this.getProductById(id);
    }

    async deleteProduct(id: number): Promise<boolean> {
        try {
            const result = await this.productRepo.delete({ productId: id });
            return (result.affected ?? 0) > 0;
        } catch (error: any) {
            // Postgres error code 23503 or MySQL 1451 indicates FK constraint violation
            if (error.code === '23503' || error.errno === 1451) {
                throw new Error('Cannot delete product because it is linked to existing orders. Consider setting it as discontinued instead.');
            }
            throw error;
        }
    }
}