import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { TerritoryService } from './territory.service.js';
import { CreateTerritoryDto } from './dto/create-territory.dto.js';
import { UpdateTerritoryDto } from './dto/update-territory.dto.js';

@Controller('territories')
export class TerritoryController {
    constructor(private readonly territoryService: TerritoryService) { }

    @Get()
    getTerritories(
        @Query('search') search?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: string,
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
    ) {
        if (search !== undefined || page !== undefined || pageSize !== undefined || sortBy !== undefined) {
            return this.territoryService.getTerritoryList(
                search || '',
                sortBy || 'territoryDescription',
                sortOrder || 'ASC',
                parseInt(page || '1', 10),
                parseInt(pageSize || '10', 10),
            );
        }
        return this.territoryService.getTerritories();
    }

    @Get(':id')
    async getTerritoryById(@Param('id') id: string) {
        const territory = await this.territoryService.getTerritoryById(id);
        if (!territory) {
            throw new NotFoundException(`Territory with ID ${id} not found`);
        }
        return territory;
    }

    @Post()
    async createTerritory(@Body() dto: CreateTerritoryDto) {
        return this.territoryService.createTerritory(dto);
    }

    @Patch(':id')
    async updateTerritory(@Param('id') id: string, @Body() dto: UpdateTerritoryDto) {
        const territory = await this.territoryService.getTerritoryById(id);
        if (!territory) {
            throw new NotFoundException(`Territory with ID ${id} not found`);
        }
        return this.territoryService.updateTerritory(id, dto);
    }

    @Delete(':id')
    async deleteTerritory(@Param('id') id: string) {
        const territory = await this.territoryService.getTerritoryById(id);
        if (!territory) {
            throw new NotFoundException(`Territory with ID ${id} not found`);
        }
        await this.territoryService.deleteTerritory(id);
        return { message: `Territory ${id} deleted` };
    }
}