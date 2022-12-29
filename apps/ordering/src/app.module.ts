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
import {
  CreateOrderHelper,
  OrderApplicationService,
} from "@delivery/orders/application";
import {OrdersDataAccessModule} from "@delivery/infra/data-access/orders";
import {CustomersDataAccessModule} from "@delivery/infra/data-access/customer";
import {
  RestaurantsDataAccessModule
} from "@delivery/infra/data-access/restaurant";
import { TypeOrmModule, TypeOrmModuleAsyncOptions} from "@nestjs/typeorm";
import {
  DB_HOST,
  DB_NAME,
  DB_PORT,
  DB_PWD,
  DB_TYPE,
  DB_USERNAME,
  getDatasource
} from "@delivery/infra/data-access/config";
import {CreateOrderCommandHandler} from "./application/handlers/CreateOrderCommandHandler";
import {OrderDomainService} from "@delivery/orders/domain";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      useFactory(configSvc: ConfigService) {
        const params = {
          type: configSvc.getOrThrow(DB_TYPE),
          host: configSvc.getOrThrow(DB_HOST),
          port: +configSvc.getOrThrow(DB_PORT),
          username: configSvc.getOrThrow(DB_USERNAME),
          password: configSvc.getOrThrow(DB_PWD),
          database: configSvc.getOrThrow(DB_NAME),
        }
        return <TypeOrmModuleAsyncOptions>{
          autoLoadEntities: true,
          synchronize: process.env.NODE_ENV !== 'production',
         ...params,
        }
      },
      dataSourceFactory: async (options) => {
        return getDatasource(options);
      },
      inject: [ConfigService]
    }),
    RestaurantsDataAccessModule,
    OrdersDataAccessModule,
    CustomersDataAccessModule,

    CqrsModule,
    KafkaModule.forRootAsync({
      brokers: [
        'localhost:19092:19092',
        'localhost:29092:19092',
        'localhost:39092:19092'
      ],
      clientId: "delivery-app",
      schemaRegistryHost: "http://localhost:8081/"
    }),

    KafkaModule.forConsumerAsync({
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
    }),
    PaymentRequestMessagingModule,
    RestaurantRequestMessagingModule,
  ],
  providers: [
    OrderDomainService,
    CreateOrderCommandHandler,
    OrderApplicationService,
    CreateOrderHelper,
  ],
  controllers: [
    OrderController
  ],
  exports: [],
})
export class AppModule {
}
