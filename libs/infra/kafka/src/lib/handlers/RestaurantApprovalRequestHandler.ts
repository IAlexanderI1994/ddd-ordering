import {OrderStatus} from "@ordering/common/domain";
import {IKafkaHandler} from "../types";
export type ProductsList = Array<{ id: string, quantity: number }>

export type RestaurantApprovalRequestAvroModel = {
  id: string;
  sagaId: string;
  restaurantId: string;
  orderId: string;
  price: number;
  createdAt: string;
  restaurantOrderStatus: OrderStatus.PAID,
  products: ProductsList
}

export class RestaurantApprovalRequestHandler implements IKafkaHandler {

  handle(event: RestaurantApprovalRequestAvroModel) {

  }
}
