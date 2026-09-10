import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service.js';
import { DataSource } from 'typeorm/browser/data-source/index.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';


@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService

    ) { }
    @Get()
    getProducts(
        @Query('search') search?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: string,
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
        @Query('supplierId') supplierId?: string,
    ) {
        return this.productService.getProducts(
            search || '',
            sortBy || 'supplierName',
            sortOrder || 'ASC',
            parseInt(page || '1', 10),
            parseInt(pageSize || '10', 10),
            supplierId ? parseInt(supplierId, 10) : undefined
        );
    }

    @Get(':id')
    async geProductById(@Param('id') id: number) {
        const product = await this.productService.getProductById(id);
        if (!product) {
            throw new Error(`Product with ID ${id} not found`);
        }
        return product;
    }

    @Post()
    async createProduct(@Body() dto: CreateProductDto) {
        return this.productService.createProduct(dto);
    }

    @Patch(':id')
    async updateProduct(@Param('id') id: number, @Body() dto: UpdateProductDto) {
        const product = await this.productService.getProductById(id);
        if (!product) {
            throw new Error(`Product with ID ${id} not found`);
        }
        return await this.productService.updateProduct(id, dto);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: number) {
        const product = await this.productService.getProductById(id);
        if (!product) {
            throw new NotFoundException(`Product ${id} not found`);
        }
        await this.productService.deleteProduct(id);
        return { message: `Product ${id} deleted` };
    }
}