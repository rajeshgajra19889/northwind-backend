import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Territory } from './territory.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class TerritoryService {
    constructor(
        @InjectRepository(Territory)
        private readonly territoryRepo: Repository<Territory>,
    ) { }

    async getTerritories(): Promise<Territory[]> {
        return this.territoryRepo.find({
            order: { territoryDescription: 'ASC' },
        });
    }

    async getTerritoryList(
        search: string,
        sortBy: string,
        sortOrder: string,
        page: number,
        pageSize: number,
    ) {
        const offSet = (page - 1) * pageSize;
        const qb = this.territoryRepo.createQueryBuilder('territory')
            .leftJoinAndSelect('territory.region', 'region');

        if (search) {
            qb.where(
                'territory.territoryDescription ILIKE :search OR territory.territoryId ILIKE :search OR region.regionDescription ILIKE :search',
                { search: `%${search}%` },
            );
        }

        const sortMap: Record<string, string> = {
            territoryId: 'territory.territoryId',
            territoryDescription: 'territory.territoryDescription',
            regionId: 'territory.regionId',
            regionName: 'region.regionDescription',
        };
        const orderBy = sortMap[sortBy] ?? 'territory.territoryDescription';
        qb.orderBy(orderBy, sortOrder === 'desc' ? 'DESC' : 'ASC');

        const total = await qb.getCount();
        const rows = await qb.skip(offSet).take(pageSize).getMany();

        const data = rows.map((territory) => ({
            territoryId: territory.territoryId,
            territoryDescription: territory.territoryDescription,
            regionId: territory.regionId,
            regionName: territory.region?.regionDescription ?? null,
        }));

        return {
            data,
            total,
            totalPages: Math.ceil(total / pageSize),
            page,
            pageSize,
        };
    }

    async getTerritoryById(id: string): Promise<Territory | null> {
        return this.territoryRepo.findOne({
            where: { territoryId: id },
            relations: { region: true },
        });
    }

    async createTerritory(data: Partial<Territory>): Promise<Territory> {
        return this.territoryRepo.save(this.territoryRepo.create(data));
    }

    async updateTerritory(id: string, data: Partial<Territory>): Promise<Territory | null> {
        await this.territoryRepo.update({ territoryId: id }, data);
        return this.getTerritoryById(id);
    }

    async deleteTerritory(id: string): Promise<boolean> {
        const result = await this.territoryRepo.delete({ territoryId: id });
        return (result.affected ?? 0) > 0;
    }
}