import { OrderStatus } from "src/modules/orders/entities/order.status.enum";

export class UpdateOrderDto{
    total?: number;
    status?: OrderStatus;
}