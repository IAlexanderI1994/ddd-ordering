import {TypeOrmModule, TypeOrmModuleAsyncOptions} from "@nestjs/typeorm";
import {Module} from "@nestjs/common"
import {RestaurantRepositoryImpl} from "@delivery/infra/data-access/restaurant";
import {RestaurantTypeORMRepository} from "./repository/RestaurantRepository";
import {RestaurantViewEntity} from "./entity/RestaurantViewEntity";
import {RestaurantProductsEntity} from "./entity/RestaurantProductsEntity";
import {RestaurantEntity} from "./entity/RestaurantEntity";
import {ProductEntity} from "./entity/ProductEntity";
import {RestaurantSubscriber} from "./db-events/RestaurantSubscriber";
import {ProductSubscriber} from "./db-events/ProductSubscriber";
import {RestaurantProductSubscriber} from "./db-events/RestaurantProductSubscriber";

const entities =  [RestaurantProductsEntity, RestaurantViewEntity, RestaurantEntity, ProductEntity]
@Module({
  imports: [
    TypeOrmModule.forFeature(entities)
  ],

  providers: [
    RestaurantProductSubscriber,
    RestaurantSubscriber,
    ProductSubscriber,
    RestaurantRepositoryImpl,
    RestaurantTypeORMRepository
  ],
  exports: [
    RestaurantRepositoryImpl,
    RestaurantTypeORMRepository
  ]
})
export class RestaurantsDataAccessModule {
}
