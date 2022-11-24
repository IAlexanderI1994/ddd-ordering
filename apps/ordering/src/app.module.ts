import {Module} from "@nestjs/common"
import {OrderController} from "./application/controllers/order.controller";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {CqrsModule} from "@nestjs/cqrs";
import {KafkaModule} from "@delivery/infra/kafka";
import * as path from "path";
import {
  PAYMENT_GROUP_ID,
  PAYMENT_REQUEST_TOPIC_NAME,
  PaymentRequestListener,
  PaymentRequestMessagingModule,
  RestaurantRequestMessagingModule
} from "@delivery/orders/messaging";
import {CreateOrderCommandHandler, OrderApplicationService} from "@delivery/orders/application";
import {OrdersDataAccessModule} from "../../../libs/infra/data-access/orders/src/lib/OrdersDataAccessModule";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    CqrsModule,
    OrdersDataAccessModule,
    KafkaModule.forRootAsync({
      brokers: [
        'localhost:19092:19092',
        'localhost:29092:19092',
        'localhost:39092:19092'
      ],
      clientId: "delivery-app",
      schemaRegistryHost: "http://localhost:8081/"
    }),
    KafkaModule.forConsumerAsync(
      {
        schemaPath: path.join(__dirname, '../../../libs/infra/kafka/src/lib/avro/schemas/payment_request.avsc'),
        listener: PaymentRequestListener,
        config: {
          useFactory: (config: ConfigService) => {
            return {
              topic: config.getOrThrow<string>(PAYMENT_REQUEST_TOPIC_NAME),
              groupId: config.getOrThrow<string>(PAYMENT_GROUP_ID),
            }
          },
          inject: [ConfigService],
        }
      }
    ),
    PaymentRequestMessagingModule,
    RestaurantRequestMessagingModule,
  ],
  providers: [
    CreateOrderCommandHandler,
    OrderApplicationService,
  ],
  controllers: [OrderController],
  exports: [],
})
export class AppModule {
}
