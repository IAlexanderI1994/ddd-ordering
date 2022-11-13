import {OrderApprovalStatus, OrderStatus} from "@delivery/common/domain";
import {Injectable, Logger} from "@nestjs/common";
import {RestaurantApprovalResponseMessageListener} from "@delivery/orders/application";
import {OrderMessagingDataMapper} from "../mappers/OrderMessagingDataMapper";
import {RestaurantApprovalResponseAvroModel, IKafkaHandler} from "@delivery/infra/kafka";
import {FAILURE_MESSAGES_DELIMITER} from "@delivery/common/config";

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

  private readonly logger = new Logger(RestaurantApprovalResponseKafkaListener.name)

  constructor(
    private readonly responseMessageListener: RestaurantApprovalResponseMessageListener
  ) {
  }
  handle(restaurantApprovalResponseAvroModel: RestaurantApprovalResponseAvroModel) {

    const restaurantApprovalResponse = OrderMessagingDataMapper.approvalResponseAvroModelToApprovalResponse(restaurantApprovalResponseAvroModel)

    if ( restaurantApprovalResponseAvroModel.orderApprovalStatus === OrderApprovalStatus.APPROVED) {

      this.logger.log(`Processing approved order for order id: ${restaurantApprovalResponseAvroModel.orderId}`)
      this.responseMessageListener.orderApproved(restaurantApprovalResponse)
    }
    else {
      const failureMessages = restaurantApprovalResponse.failureMessages.join(FAILURE_MESSAGES_DELIMITER)
      this.logger.error(`Processing rejected order for order id: ${restaurantApprovalResponseAvroModel.orderId}, with failure messages: ${failureMessages}`)
      this.responseMessageListener.orderRejected(restaurantApprovalResponse)
    }

  }
}
