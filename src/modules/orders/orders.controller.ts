import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from 'src/common/dto/create-order-dto';
import { UpdateOrderDto } from 'src/common/dto/update-order-dto';

@Controller('orders')
export class OrdersController {
    constructor(private readonly orderService: OrdersService){}

    @Get()
    findAll() {
      return this.orderService.findAll();
    }

    @Get(':id')
    findOne(@Param('id')id: string) {
        return this.orderService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateOrderDto) {
        return this.orderService.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateOrderDto){
        return this.orderService.update(id, dto)
    }

    @Delete(':id')
    delete(@Param('id') id: string){
        return this.orderService.delete(id);
    }


}
