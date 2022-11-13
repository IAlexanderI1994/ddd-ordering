import {Injectable, Logger} from "@nestjs/common";
import {OrderCancelledEvent} from "@delivery/orders/domain";
import {KafkaProducer, PaymentRequestAvroModel} from "@delivery/infra/kafka";
import {OrderMessagingDataMapper} from "../mappers/OrderMessagingDataMapper";
import {
  IOrderCancelledPaymentRequestMessagePublisher
} from "@delivery/orders/application";


@Injectable()
export class CancelOrderKafkaMessagePublisher implements IOrderCancelledPaymentRequestMessagePublisher{


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
