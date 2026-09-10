import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { SupplierService } from './supplier.service.js';
import { CreateSupplierDto } from './dto/create-supplier.dto.js';
import { UpdateSupplierDto } from './dto/update-supplier.dto.js';

@Controller('suppliers')
export class SupplierController {
    constructor(private readonly supplierService: SupplierService) { }

    @Get()
    getSuppliers(
        @Query('search') search?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: string,
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
    ) {
        if (search !== undefined || page !== undefined || pageSize !== undefined || sortBy !== undefined) {
            return this.supplierService.getSupplierList(
                search || '',
                sortBy || 'companyName',
                sortOrder || 'ASC',
                parseInt(page || '1', 10),
                parseInt(pageSize || '10', 10),
            );
        }
        return this.supplierService.getSuppliers();
    }

    @Get(':id')
    async getSupplierById(@Param('id', ParseIntPipe) id: number) {
        const supplier = await this.supplierService.getSupplierById(id);
        if (!supplier) {
            throw new NotFoundException(`Supplier with ID ${id} not found`);
        }
        return supplier;
    }

    @Post()
    async createSupplier(@Body() dto: CreateSupplierDto) {
        return this.supplierService.createSupplier(dto);
    }

    @Patch(':id')
    async updateSupplier(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSupplierDto) {
        const supplier = await this.supplierService.getSupplierById(id);
        if (!supplier) {
            throw new NotFoundException(`Supplier with ID ${id} not found`);
        }
        return this.supplierService.updateSupplier(id, dto);
    }

    @Delete(':id')
    async deleteSupplier(@Param('id', ParseIntPipe) id: number) {
        const supplier = await this.supplierService.getSupplierById(id);
        if (!supplier) {
            throw new NotFoundException(`Supplier with ID ${id} not found`);
        }
        await this.supplierService.deleteSupplier(id);
        return { message: `Supplier ${id} deleted` };
    }
}