import { OrderStatus } from "src/modules/orders/entities/order.status.enum";

export class UpdateOrderStatusDto {
  status!: OrderStatus;
}
