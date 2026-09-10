import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ShipperService } from './shipper.service.js';
import { CreateShipperDto } from './dto/create-shipper.dto.js';
import { UpdateShipperDto } from './dto/update-shipper.dto.js';

@Controller('shippers')
export class ShipperController {
    constructor(private readonly shipperService: ShipperService) { }

    @Get()
    getShippers(
        @Query('search') search?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: string,
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
    ) {
        if (search !== undefined || page !== undefined || pageSize !== undefined || sortBy !== undefined) {
            return this.shipperService.getShipperList(
                search || '',
                sortBy || 'companyName',
                sortOrder || 'ASC',
                parseInt(page || '1', 10),
                parseInt(pageSize || '10', 10),
            );
        }
        return this.shipperService.getShippers();
    }

    @Get(':id')
    async getShipperById(@Param('id', ParseIntPipe) id: number) {
        const shipper = await this.shipperService.getShipperById(id);
        if (!shipper) {
            throw new NotFoundException(`Shipper with ID ${id} not found`);
        }
        return shipper;
    }

    @Post()
    async createShipper(@Body() dto: CreateShipperDto) {
        return this.shipperService.createShipper(dto);
    }

    @Patch(':id')
    async updateShipper(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateShipperDto) {
        const shipper = await this.shipperService.getShipperById(id);
        if (!shipper) {
            throw new NotFoundException(`Shipper with ID ${id} not found`);
        }
        return this.shipperService.updateShipper(id, dto);
    }

    @Delete(':id')
    async deleteShipper(@Param('id', ParseIntPipe) id: number) {
        const shipper = await this.shipperService.getShipperById(id);
        if (!shipper) {
            throw new NotFoundException(`Shipper with ID ${id} not found`);
        }
        await this.shipperService.deleteShipper(id);
        return { message: `Shipper ${id} deleted` };
    }
}