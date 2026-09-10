import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Get()
    getCategories(
        @Query('search') search?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: string,
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
    ) {
        if (search !== undefined || page !== undefined || pageSize !== undefined || sortBy !== undefined) {
            return this.categoryService.getCategoryList(
                search || '',
                sortBy || 'categoryName',
                sortOrder || 'ASC',
                parseInt(page || '1', 10),
                parseInt(pageSize || '10', 10),
            );
        }
        return this.categoryService.getCategories();
    }

    @Get(':id')
    async getCategoryById(@Param('id', ParseIntPipe) id: number) {
        const category = await this.categoryService.getCategoryById(id);
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }

    @Post()
    async createCategory(@Body() dto: CreateCategoryDto) {
        return this.categoryService.createCategory(dto);
    }

    @Patch(':id')
    async updateCategory(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
        const category = await this.categoryService.getCategoryById(id);
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return this.categoryService.updateCategory(id, dto);
    }

    @Delete(':id')
    async deleteCategory(@Param('id', ParseIntPipe) id: number) {
        const category = await this.categoryService.getCategoryById(id);
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        await this.categoryService.deleteCategory(id);
        return { message: `Category ${id} deleted` };
    }
}