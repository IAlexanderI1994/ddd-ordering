import {OrderStatus} from "@delivery/common/domain";

export type ProductsList = Array<{ id: string, quantity: number }>
export type RestaurantApprovalRequestAvroModelData = {
  id: string;
  sagaId: string;
  restaurantId: string;
  orderId: string;
  price: number;
  createdAt: string;
  restaurantOrderStatus: OrderStatus.PAID,
  products: ProductsList
}


export class RestaurantApprovalRequestAvroModel implements RestaurantApprovalRequestAvroModelData {
  constructor(
    data: RestaurantApprovalRequestAvroModelData
  ) {
    Object.assign(this, data)
  }

  createdAt: string;
  id: string;
  orderId: string;
  price: number;
  products: ProductsList;
  restaurantId: string;
  restaurantOrderStatus: OrderStatus.PAID;
  sagaId: string;
}
