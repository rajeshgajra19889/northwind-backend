import { Controller, Get, Query } from '@nestjs/common';
import { CustomerService } from './customer.service.js';


@Controller('customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }
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
}

