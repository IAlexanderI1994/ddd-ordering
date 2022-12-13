import {TypeOrmModule} from "@nestjs/typeorm";
import {OrderEntity} from "./entity/OrderEntity";
import {OrderItemEntity} from "./entity/OrderItemEntity";
import {OrderAddressEntity} from "./entity/OrderAddressEntity";
import {Module} from "@nestjs/common"
import {OrderRepositoryImpl} from "./repository/OrderRepositoryImpl";

const entities =  [OrderEntity, OrderItemEntity, OrderAddressEntity]
@Module({
  imports: [
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
