import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from 'src/common/dto/create-order-dto';
import { UpdateOrderDto } from 'src/common/dto/update-order-dto';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { UpdateOrderStatusDto } from 'src/common/dto/update-order-status-dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    
    @InjectRepository(OrderItem)  
    private readonly orderItemRepository: Repository<OrderItem>,
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

  async create(dto: CreateOrderDto): Promise<Order> {
  const items: OrderItem[] = [];

  let total = 0;

  for (const item of dto.items) {
    const product = await this.productRepository.findOne({
      where: { id: item.productId }
    });

    if (!product) {
      throw new NotFoundException(`Product ${item.productId} not found`);
    }

    const orderItem = this.orderItemRepository.create({
      productId: product.id,
      quantity: item.quantity,
      price: product.price
    });

    total += product.price * item.quantity;

    items.push(orderItem);
  }

  const order = this.orderRepository.create({
    userId: dto.userId,
    total,
    items
  });

  return await this.orderRepository.save(order);
}


  async update(id: string, dto: UpdateOrderDto):Promise<Order> {
   const order = await this.orderRepository.findOne({
    where: { id },
    relations: {
      items: true
    }
   });

   if(!order){
    throw new NotFoundException(`Order ${id} not found`);
   }

   if (!dto.items) {
    return order;
   }

   order.items = [];

   let total = 0;

   for (const item of dto.items) {
    const product = await this.productRepository.findOne({
      where: {id: item.productId}
    });

    if (!product) {
      throw new NotFoundException('Product ${item.productId} not found');
    }

    const orderItem = this.orderItemRepository.create({
      orderId : order.id,
      productId: product.id,
      quantity: item.quantity,
      price: product.price  
    });

    total += product.price * item.quantity;

    order.items.push(orderItem);
   }

   order.total = total;

   return await this.orderRepository.save(order);
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order>{
    const order = await this.orderRepository.findOne({ where: { id }});

    if(!order){
       throw new NotFoundException(`Order ${id} not found`);
    }

    order.status = dto.status;

    return await this.orderRepository.save(order);
  }


  async delete(id: string): Promise<Order | null> {
    const order = await this.findOne(id);

    await this.orderRepository.delete(id);

    return order;
  }
}
