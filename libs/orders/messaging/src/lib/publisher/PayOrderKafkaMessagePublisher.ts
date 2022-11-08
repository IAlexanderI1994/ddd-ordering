import {Injectable, Logger} from "@nestjs/common";
import {OrderPaidEvent} from "@ordering/orders/domain";
import {KafkaProducer, PaymentRequestAvroModel} from "@ordering/infra/kafka";
import {OrderMessagingDataMapper} from "../mappers/OrderMessagingDataMapper";
import {
  RestaurantApprovalRequestAvroModel
} from "@ordering/infra/kafka";
import {
  IOrderPaidRestaurantRequestMessagePublisher
} from "@ordering/orders/application";


@Injectable()
export class PayOrderKafkaMessagePublisher implements IOrderPaidRestaurantRequestMessagePublisher{

  private readonly logger = new Logger(PayOrderKafkaMessagePublisher.name)
  constructor(
    private readonly kafkaProducer: KafkaProducer,
  ) {
  }

  async publish(domainEvent: OrderPaidEvent): Promise<void> {

    const avroModel: RestaurantApprovalRequestAvroModel = OrderMessagingDataMapper.orderPaidEventToRestaurantApprovalRequestAvroModel(domainEvent)

    try {
      const response = await this.kafkaProducer.publish<RestaurantApprovalRequestAvroModel>(avroModel)
      this.logger.log(`Received successful response from kafka for order id: ${avroModel.orderId}`)
      this.logger.log(JSON.stringify(response))

    }
    catch (e) {
      this.logger.error(`Error while sending ${PaymentRequestAvroModel.name}. Message: ${e.message}`)
      this.logger.error(`Stack: ${e.stack}`)

    }

  }



}
