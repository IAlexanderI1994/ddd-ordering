import {BaseEntity, OrderId, OrderItemId} from "@ordering/common/domain";
import {Product} from "./product";

export class OrderItem extends BaseEntity<OrderItemId>{

  private readonly orderId: OrderId;

  private readonly product: Product;

}
