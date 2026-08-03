import { OrderStatus } from "src/modules/orders/entities/order.status.enum";

  export class UpdateOrderDto {
  items?: {
    productId: string;
    quantity: number;
  }[];
}

