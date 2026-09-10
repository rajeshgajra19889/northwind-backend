import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';

@Controller('employees')
export class EmployeeController {
    constructor(
        private readonly employeeService: EmployeeService
    ) { }

    @Get()
    getEmployees(
        @Query('search') search?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: string,
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
    ) {
        return this.employeeService.getEmployees(
            search || '',
            sortBy || 'lastName',
            sortOrder || 'ASC',
            parseInt(page || '1', 10),
            parseInt(pageSize || '10', 10)
        );
    }

    @Get(':id')
    async getEmployeeById(@Param('id', ParseIntPipe) id: number) {
        const employee = await this.employeeService.getEmployeeById(id);
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }
        return employee;
    }

    @Post()
    async createEmployee(@Body() dto: CreateEmployeeDto) {
        return this.employeeService.createEmployee(dto);
    }

    @Patch(':id')
    async updateEmployee(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmployeeDto) {
        const employee = await this.employeeService.getEmployeeById(id);
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }
        return await this.employeeService.updateEmployee(id, dto);
    }

    @Get(':id/territories')
    async getEmployeeTerritories(@Param('id', ParseIntPipe) id: number) {
        const employee = await this.employeeService.getEmployeeById(id);
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }
        return this.employeeService.getEmployeeTerritories(id);
    }

    @Get(':id/territories/available')
    async getAvailableTerritories(@Param('id', ParseIntPipe) id: number) {
        const employee = await this.employeeService.getEmployeeById(id);
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }
        return this.employeeService.getAvailableTerritories(id);
    }

    @Post(':id/territories/:territoryId')
    async assignTerritory(
        @Param('id', ParseIntPipe) id: number,
        @Param('territoryId') territoryId: string,
    ) {
        const employee = await this.employeeService.getEmployeeById(id);
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }
        await this.employeeService.assignTerritory(id, territoryId);
        return { message: `Territory ${territoryId} assigned` };
    }

    @Delete(':id/territories/:territoryId')
    async unassignTerritory(
        @Param('id', ParseIntPipe) id: number,
        @Param('territoryId') territoryId: string,
    ) {
        const employee = await this.employeeService.getEmployeeById(id);
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }
        await this.employeeService.unassignTerritory(id, territoryId);
        return { message: `Territory ${territoryId} unassigned` };
    }

    @Delete(':id')
    async deleteEmployee(@Param('id', ParseIntPipe) id: number) {
        const employee = await this.employeeService.getEmployeeById(id);
        if (!employee) {
            throw new NotFoundException(`Employee ${id} not found`);
        }
        await this.employeeService.deleteEmployee(id);
        return { message: `Employee ${id} deleted` };
    }
}
