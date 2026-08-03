import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from 'src/common/dto/create-product-dto';
import { UpdateProductDto } from 'src/common/dto/update-product-dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService){}

    @Get()
    findAll(){
        return this.productService.findAll();
    }

    @Get(':id')
    findOne(@Param('id')id: string){
        return this.productService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateProductDto){
        return this.productService.create(dto);
    }

    @Patch(':id')
    update(@Param('id')id: string, @Body() dto: UpdateProductDto){
        return this.productService.update(id, dto)
    }

    @Delete(':id')
    delete(@Param('id') id: string){
        return this.productService.delete(id);
    }
}
