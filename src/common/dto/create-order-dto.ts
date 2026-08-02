import { OrderStatus } from "src/modules/orders/entities/order.status.enum";

export class CreateOrderDto{
    userId!: string;
    total!: number;
    status!: OrderStatus;
}