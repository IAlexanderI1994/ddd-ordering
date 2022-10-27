import {Module} from "@nestjs/common"
import {KafkaModule} from "@ordering/infra/kafka";
import {CreateOrderKafkaMessagePublisher} from "../publisher/CreateOrderKafkaMessagePublisher";
import {CancelOrderKafkaMessagePublisher} from "../publisher/CancelOrderKafkaMessagePublisher";
import * as path from "path";
import {ConfigService} from "@nestjs/config";
import {PAYMENT_REQUEST_TOPIC_NAME} from "../config/constants";

@Module({
  imports: [
    KafkaModule.forProducerAsync({
      schemaPath: path.join(__dirname, '../avro/payment_request.avsc'),
      config: {
        useFactory: (config: ConfigService) => {
          return {
            topic: config.getOrThrow<string>(PAYMENT_REQUEST_TOPIC_NAME),
          }
        },
        inject: [ConfigService],
      }
    })
  ],
  providers: [
    CreateOrderKafkaMessagePublisher,
    CancelOrderKafkaMessagePublisher
  ],
  controllers: [],
  exports: [],
})
export class PaymentRequestMessagingModule {
}
