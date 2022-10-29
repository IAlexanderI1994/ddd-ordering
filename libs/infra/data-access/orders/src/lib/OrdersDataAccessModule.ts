import {TypeOrmModule} from "@nestjs/typeorm";
import {OrderEntity} from "./entity/OrderEntity";
import {OrderItemEntity} from "./entity/OrderItemEntity";
import {OrderAddressEntity} from "./entity/OrderAddressEntity";
import {Module} from "@nestjs/common"
import {OrderRepositoryImpl} from "./repository/OrderRepositoryImpl";

const entities =  [OrderEntity, OrderItemEntity, OrderAddressEntity]
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'test',
      entities,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature(entities)
  ],

  providers: [
    OrderRepositoryImpl
  ]
})
export class OrdersDataAccessModule {
}
