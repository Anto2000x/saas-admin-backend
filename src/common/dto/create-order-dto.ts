import { OrderStatus } from "src/modules/orders/entities/order.status.enum";

export class CreateOrderDto{
    userId!: string;
    items!: {
        productId: string;
        quantity: number;
    }[];
}