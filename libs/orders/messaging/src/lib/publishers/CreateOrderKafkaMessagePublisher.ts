import {Inject, Injectable, Logger} from "@nestjs/common";
import {IDomainEventPublisher} from "@delivery/common/domain";
import {OrderCreatedEvent} from "@delivery/orders/domain";
import {KafkaProducer, PaymentRequestAvroModel} from "@delivery/infra/kafka";
import {OrderMessagingDataMapper} from "../mappers/OrderMessagingDataMapper";
import {IOrderCreatedPaymentRequestMessagePublisher} from "@delivery/orders/application";


@Injectable()
export class CreateOrderKafkaMessagePublisher implements IOrderCreatedPaymentRequestMessagePublisher{


  private readonly logger = new Logger(CreateOrderKafkaMessagePublisher.name)
  constructor(private readonly kafkaProducer: KafkaProducer) {}

  async publish(domainEvent: OrderCreatedEvent): Promise<void> {

    const avroModel: PaymentRequestAvroModel = OrderMessagingDataMapper.orderCreatedEventToPaymentRequestAvroModel(domainEvent)

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
