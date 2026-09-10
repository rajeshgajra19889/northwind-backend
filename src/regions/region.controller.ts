import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { RegionService } from './region.service.js';
import { CreateRegionDto } from './dto/create-region.dto.js';
import { UpdateRegionDto } from './dto/update-region.dto.js';

@Controller('regions')
export class RegionController {
    constructor(private readonly regionService: RegionService) { }

    @Get()
    getRegions(
        @Query('search') search?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: string,
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
    ) {
        if (search !== undefined || page !== undefined || pageSize !== undefined || sortBy !== undefined) {
            return this.regionService.getRegionList(
                search || '',
                sortBy || 'regionDescription',
                sortOrder || 'ASC',
                parseInt(page || '1', 10),
                parseInt(pageSize || '10', 10),
            );
        }
        return this.regionService.getRegions();
    }

    @Get(':id')
    async getRegionById(@Param('id', ParseIntPipe) id: number) {
        const region = await this.regionService.getRegionById(id);
        if (!region) {
            throw new NotFoundException(`Region with ID ${id} not found`);
        }
        return region;
    }

    @Post()
    async createRegion(@Body() dto: CreateRegionDto) {
        return this.regionService.createRegion(dto);
    }

    @Patch(':id')
    async updateRegion(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRegionDto) {
        const region = await this.regionService.getRegionById(id);
        if (!region) {
            throw new NotFoundException(`Region with ID ${id} not found`);
        }
        return this.regionService.updateRegion(id, dto);
    }

    @Delete(':id')
    async deleteRegion(@Param('id', ParseIntPipe) id: number) {
        const region = await this.regionService.getRegionById(id);
        if (!region) {
            throw new NotFoundException(`Region with ID ${id} not found`);
        }
        await this.regionService.deleteRegion(id);
        return { message: `Region ${id} deleted` };
    }
}