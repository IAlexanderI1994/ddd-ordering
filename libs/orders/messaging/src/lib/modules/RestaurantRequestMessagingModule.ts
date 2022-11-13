import {Module} from "@nestjs/common"
import {KafkaModule} from "@delivery/infra/kafka";
import * as path from "path";
import {PayOrderKafkaMessagePublisher} from "../publishers/PayOrderKafkaMessagePublisher";
import {ConfigService} from "@nestjs/config";
import {
  RESTAURANT_APPROVAL_REQUEST_TOPIC_NAME,
} from "../config/constants";

@Module({
  imports: [
    KafkaModule.forProducerAsync({
      schemaPath: path.join(__dirname, '../avro/restaurant_approval_request.avsc'),
      config: {
        useFactory: (config: ConfigService) => {
          return {
            topic: config.getOrThrow<string>(RESTAURANT_APPROVAL_REQUEST_TOPIC_NAME),
          }
        },
        inject: [ConfigService],
      }
    }),
  ],
  providers: [
    PayOrderKafkaMessagePublisher
  ],
  controllers: [],
  exports: [],
})
export class RestaurantRequestMessagingModule {
}
