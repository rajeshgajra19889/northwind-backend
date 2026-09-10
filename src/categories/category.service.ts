import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity.js';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
        @InjectDataSource() private readonly dataSource: DataSource,
    ) { }

    async getCategories(): Promise<Category[]> {
        return this.categoryRepo.find({
            order: { categoryName: 'ASC' },
        });
    }

    async getCategoryList(
        search: string,
        sortBy: string,
        sortOrder: string,
        page: number,
        pageSize: number,
    ) {
        const offSet = (page - 1) * pageSize;
        const qb = this.categoryRepo.createQueryBuilder('category');

        if (search) {
            qb.where(
                'category.categoryName ILIKE :search OR category.description ILIKE :search',
                { search: `%${search}%` },
            );
        }

        const sortMap: Record<string, string> = {
            categoryId: 'category.categoryId',
            categoryName: 'category.categoryName',
            description: 'category.description',
        };
        const orderBy = sortMap[sortBy] ?? 'category.categoryName';
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

    async getCategoryById(id: number): Promise<Category | null> {
        return this.categoryRepo.findOneBy({ categoryId: id });
    }

    async createCategory(data: Partial<Category>): Promise<Category> {
        const [{ nextId }] = await this.dataSource.query(
            `SELECT COALESCE(MAX(category_id), 0) + 1 AS "nextId" FROM categories`,
        );
        return this.categoryRepo.save(this.categoryRepo.create({ ...data, categoryId: nextId }));
    }

    async updateCategory(id: number, data: Partial<Category>): Promise<Category | null> {
        await this.categoryRepo.update({ categoryId: id }, data);
        return this.getCategoryById(id);
    }

    async deleteCategory(id: number): Promise<boolean> {
        try {
            const result = await this.categoryRepo.delete({ categoryId: id });
            return (result.affected ?? 0) > 0;
        } catch (error: any) {
            if (error.code === '23503' || error.errno === 1451) {
                throw new Error('Cannot delete category because it is linked to existing products.');
            }
            throw error;
        }
    }
}