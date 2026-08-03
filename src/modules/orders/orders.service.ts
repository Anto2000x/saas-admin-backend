import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from 'src/common/dto/create-order-dto';
import { UpdateOrderDto } from 'src/common/dto/update-order-dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<Order[]>{
    return this.orderRepository.find();
  }

  async findOne(id: string): Promise<Order | null>{
    const order = await this.orderRepository.findOne({ where: {id},});

    if(!Order){
        throw new NotFoundException('Order with id ${id} not found')
    }

    return order;
  }

  async create(dto: CreateOrderDto):Promise<Order> {
    const order = this.orderRepository.create(dto);
    return await this.orderRepository.save(order);
  }

  async update(id: string, dto: UpdateOrderDto):Promise<Order> {
    const order = await this.orderRepository.findOne({where: {id}});

    if(!order){
        throw new NotFoundException('User with id ${id} not found')
    }

    Object.assign(order, dto);
    return await this.orderRepository.save(order);
  }

  async delete(id: string): Promise<Order | null> {
    const order = await this.findOne(id);

    await this.orderRepository.delete(id);

    return order;
  }
}
