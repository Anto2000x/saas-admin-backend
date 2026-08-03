import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { CreateProductDto } from 'src/common/dto/create-product-dto';
import { UpdateProductDto } from 'src/common/dto/update-product-dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ){}

    async findAll(): Promise<Product[]>{
        return this.productRepository.find();
    }

    async findOne(id: string): Promise<Product | null>{
        const product = await this.productRepository.findOne({where: {id},});

        if(!Product){
            throw new NotFoundException('Product with id ${id} not found')
        }

        return product;
    }

    async create(dto: CreateProductDto):Promise<Product> {
        const product = this.productRepository.create(dto);
        return await this.productRepository.save(product);
    }

    async update(id: string, dto: UpdateProductDto):Promise<Product> {
        const product = await this.productRepository.findOne({where: {id}});

        if(!product){
            throw new NotFoundException('Product with id ${id} not found')
        }

        Object.assign(product, dto);
        return await this.productRepository.save(product);
    }

    async delete(id: string): Promise<Product | null>{
        const product = await this.findOne(id);

        await this.productRepository.delete(id);

        return product;
    }
    }
