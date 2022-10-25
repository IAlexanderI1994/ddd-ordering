import {Injectable, Logger} from "@nestjs/common";
import {IDomainEventPublisher} from "@ordering/common/domain";
import {OrderCancelledEvent, OrderCreatedEvent} from "@ordering/orders/domain";
import {KafkaProducer, PaymentRequestAvroModel} from "@ordering/infra/kafka";
import {OrderMessagingDataMapper} from "../mappers/OrderMessagingDataMapper";


@Injectable()
export class CancelOrderKafkaMessagePublisher implements IDomainEventPublisher<OrderCreatedEvent>{


  private readonly logger = new Logger(CancelOrderKafkaMessagePublisher.name)
  constructor(
    private readonly kafkaProducer: KafkaProducer,
  ) {
  }

  async publish(domainEvent: OrderCancelledEvent): Promise<void> {

    const avroModel: PaymentRequestAvroModel = OrderMessagingDataMapper.orderCancelledEventToPaymentRequestAvroModel(domainEvent)

    try {
      const response = await this.kafkaProducer.publish<PaymentRequestAvroModel>(
        avroModel
      )
      this.logger.log(`Received successful response from kafka for order id: ${avroModel.orderId}`)
      this.logger.log(JSON.stringify(response))
    }
    catch (e) {
      this.logger.error(`Error while sending ${PaymentRequestAvroModel.name}. Message: ${e.message}`)
      this.logger.error(`Stack: ${e.stack}`)

    }

  }



}
