import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Region } from './region.entity.js';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class RegionService {
    constructor(
        @InjectRepository(Region)
        private readonly regionRepo: Repository<Region>,
        @InjectDataSource() private readonly dataSource: DataSource,
    ) { }

    async getRegions(): Promise<Region[]> {
        return this.regionRepo.find({
            order: { regionDescription: 'ASC' },
        });
    }

    async getRegionList(
        search: string,
        sortBy: string,
        sortOrder: string,
        page: number,
        pageSize: number,
    ) {
        const offSet = (page - 1) * pageSize;
        const qb = this.regionRepo.createQueryBuilder('region');

        if (search) {
            qb.where('region.regionDescription ILIKE :search', {
                search: `%${search}%`,
            });
        }

        const sortMap: Record<string, string> = {
            regionId: 'region.regionId',
            regionDescription: 'region.regionDescription',
        };
        const orderBy = sortMap[sortBy] ?? 'region.regionDescription';
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

    async getRegionById(id: number): Promise<Region | null> {
        return this.regionRepo.findOneBy({ regionId: id });
    }

    async createRegion(data: Partial<Region>): Promise<Region> {
        const [{ nextId }] = await this.dataSource.query(
            `SELECT COALESCE(MAX(region_id), 0) + 1 AS "nextId" FROM region`,
        );
        return this.regionRepo.save(this.regionRepo.create({ ...data, regionId: nextId }));
    }

    async updateRegion(id: number, data: Partial<Region>): Promise<Region | null> {
        await this.regionRepo.update({ regionId: id }, data);
        return this.getRegionById(id);
    }

    async deleteRegion(id: number): Promise<boolean> {
        try {
            const result = await this.regionRepo.delete({ regionId: id });
            return (result.affected ?? 0) > 0;
        } catch (error: any) {
            if (error.code === '23503' || error.errno === 1451) {
                throw new BadRequestException(
                    'Cannot delete region because it is linked to existing territories.',
                );
            }
            throw error;
        }
    }
}