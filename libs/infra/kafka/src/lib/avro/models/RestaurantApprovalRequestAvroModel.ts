import {OrderStatus} from "@ordering/common/domain";
import {Product} from "@ordering/orders/domain";

export type RestaurantApprovalRequestAvroModelData = {
  id: string;
  sagaId: string;
  restaurantId: string;
  orderId: string;
  price: number;
  createdAt: string;
  restaurantOrderStatus: OrderStatus.PAID,
  products: Array<typeof Product>
}


export class RestaurantApprovalRequestAvroModel implements RestaurantApprovalRequestAvroModelData{
  constructor(
    data: RestaurantApprovalRequestAvroModelData
  ) {
    Object.assign(this, data)
  }

  createdAt: string;
  id: string;
  orderId: string;
  price: number;
  products: Array<typeof Product>;
  restaurantId: string;
  restaurantOrderStatus: OrderStatus.PAID;
  sagaId: string;
}
