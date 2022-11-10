import {OrderStatus} from "@ordering/common/domain";
import {IKafkaHandler} from "../../../../../infra/kafka/src/lib/types";
import {Injectable} from "@nestjs/common";
import { RestaurantApprovalResponseMessageListener} from "@ordering/orders/application";
import {OrderMessagingDataMapper} from "../mappers/OrderMessagingDataMapper";
import {
  RestaurantApprovalResponseAvroModel
} from "@ordering/infra/kafka";
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

@Injectable()
export class RestaurantApprovalResponseKafkaListener implements IKafkaHandler {

  constructor(
    private readonly responseMessageListener: RestaurantApprovalResponseMessageListener
  ) {
  }
  handle(data: RestaurantApprovalResponseAvroModel) {

    const paymentResponse = OrderMessagingDataMapper.approvalResponseAvroModelToApprovalResponse(data)

  }
}
