import {TypeOrmModule, TypeOrmModuleAsyncOptions} from "@nestjs/typeorm";
import {OrderEntity} from "./entity/OrderEntity";
import {OrderItemEntity} from "./entity/OrderItemEntity";
import {OrderAddressEntity} from "./entity/OrderAddressEntity";
import {Module} from "@nestjs/common"
import {OrderRepositoryImpl} from "./repository/OrderRepositoryImpl";
import {ConfigService} from "@nestjs/config";
import {DB_HOST, DB_NAME, DB_PORT, DB_PWD, DB_TYPE, DB_USERNAME} from "./config/postgres";

const entities =  [OrderEntity, OrderItemEntity, OrderAddressEntity]
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
        useFactory(configSvc: ConfigService) {
          return <TypeOrmModuleAsyncOptions>{
            type: configSvc.getOrThrow(DB_TYPE),
            host: configSvc.getOrThrow(DB_HOST),
            port: +configSvc.getOrThrow(DB_PORT),
            username: configSvc.getOrThrow(DB_USERNAME),
            password: configSvc.getOrThrow(DB_PWD),
            database: configSvc.getOrThrow(DB_NAME),
            entities,
            synchronize: process.env.NODE_ENV !== 'production',
          }
        },
      inject: [ConfigService]
      }),
    TypeOrmModule.forFeature(entities)
  ],

  providers: [
    OrderRepositoryImpl
  ],
  exports: [
    OrderRepositoryImpl
  ]
})
export class OrdersDataAccessModule {
}
