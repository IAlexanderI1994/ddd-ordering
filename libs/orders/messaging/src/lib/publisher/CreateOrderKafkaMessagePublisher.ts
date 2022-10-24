import {Injectable, Logger} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {IDomainEventPublisher} from "@ordering/common/domain";
import {OrderCreatedEvent} from "@ordering/orders/domain";
import {KafkaProducer, PaymentRequestAvroModel} from "@ordering/infra/kafka";
import {PAYMENT_REQUEST_TOPIC_NAME} from "@ordering/orders/messaging";
import {OrderMessagingDataMapper} from "../mappers/OrderMessagingDataMapper";


@Injectable()
export class CreateOrderKafkaMessagePublisher implements IDomainEventPublisher<OrderCreatedEvent>{


  private readonly logger = new Logger(CreateOrderKafkaMessagePublisher.name)
  constructor(
    private readonly kafkaProducer: KafkaProducer,
    private readonly configService: ConfigService
  ) {
  }

  async publish(domainEvent: OrderCreatedEvent): Promise<void> {

    const avroModel: PaymentRequestAvroModel = OrderMessagingDataMapper.orderCreatedEventToPaymentRequestAvroModel(domainEvent)

    try {
      const response = await this.kafkaProducer.publish<PaymentRequestAvroModel>(
        this.configService.getOrThrow<string>(PAYMENT_REQUEST_TOPIC_NAME),
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
