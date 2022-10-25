import {Injectable, Logger} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {IDomainEventPublisher} from "@ordering/common/domain";
import {OrderCancelledEvent, OrderCreatedEvent, OrderPaidEvent} from "@ordering/orders/domain";
import {KafkaProducer, PaymentRequestAvroModel} from "@ordering/infra/kafka";
import {PAYMENT_REQUEST_TOPIC_NAME} from "@ordering/orders/messaging";
import {OrderMessagingDataMapper} from "../mappers/OrderMessagingDataMapper";
import {
  RestaurantApprovalRequestAvroModel
} from "../../../../../infra/kafka/src/lib/avro/models/RestaurantApprovalRequestAvroModel";


@Injectable()
export class PayOrderKafkaMessagePublisher implements IDomainEventPublisher<OrderCreatedEvent>{


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
