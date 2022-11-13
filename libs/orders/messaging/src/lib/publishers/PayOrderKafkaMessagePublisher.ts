import {Injectable, Logger} from "@nestjs/common";
import {OrderPaidEvent} from "@delivery/orders/domain";
import {KafkaProducer, PaymentRequestAvroModel} from "@delivery/infra/kafka";
import {OrderMessagingDataMapper} from "../mappers/OrderMessagingDataMapper";
import {
  RestaurantApprovalRequestAvroModel
} from "@delivery/infra/kafka";
import {
  IOrderPaidRestaurantRequestMessagePublisher
} from "@delivery/orders/application";


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
