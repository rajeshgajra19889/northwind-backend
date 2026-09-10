import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { CustomerService } from './customer.service.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';
import { DataSource } from 'typeorm/browser/data-source/index.js';


@Controller('customers')
export class CustomerController {
    constructor(
        private readonly customerService: CustomerService

    ) { }
    @Get()
    getCustomers(
        @Query('search') search?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: string,
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
    ) {
        return this.customerService.getCustomers(
            search || '',
            sortBy || 'companyName',
            sortOrder || 'ASC',
            parseInt(page || '1', 10),
            parseInt(pageSize || '10', 10)
        );
    }
    @Get(':id')
    async getCustomerById(@Param('id') id: string) {
        const customer = await this.customerService.getCustomerById(id);
        if (!customer) {
            throw new Error(`Customer with ID ${id} not found`);
        }
        return customer;
    }

    @Post()
    async createCustomer(@Body() dto: CreateCustomerDto) {
        return this.customerService.createCustomer(dto);
    }

    @Patch(':id')
    async updateCustomer(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
        const customer = await this.customerService.getCustomerById(id);
        if (!customer) {
            throw new Error(`Customer with ID ${id} not found`);
        }
        return await this.customerService.updateCustomer(id, dto);
    }

    @Delete(':id')
    async deleteCustomer(@Param('id') id: string) {
        const customer = await this.customerService.getCustomerById(id);
        if (!customer) {
            throw new NotFoundException(`Customer ${id} not found`);
        }
        await this.customerService.deleteCustomer(id);
        return { message: `Customer ${id} deleted` };
    }

}

