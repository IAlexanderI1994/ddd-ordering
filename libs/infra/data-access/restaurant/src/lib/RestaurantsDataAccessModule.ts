import {TypeOrmModule, TypeOrmModuleAsyncOptions} from "@nestjs/typeorm";
import {Module} from "@nestjs/common"
import {ConfigService} from "@nestjs/config";
import {DB_HOST, DB_NAME, DB_PORT, DB_PWD, DB_TYPE, DB_USERNAME} from "@delivery/infra/data-access/config";
import {RestaurantRepositoryImpl} from "@delivery/infra/data-access/restaurant";
import {RestaurantTypeORMRepository} from "./repository/RestaurantRepository";
import {RestaurantViewEntity} from "./entity/RestaurantViewEntity";
import {RestaurantProductsEntity} from "./entity/RestaurantProductsEntity";
import {RestaurantEntity} from "./entity/RestaurantEntity";
import {ProductEntity} from "./entity/ProductEntity";

const entities =  [RestaurantProductsEntity, RestaurantViewEntity, RestaurantEntity, ProductEntity]
@Module({
  imports: [
    TypeOrmModule.forFeature(entities)
  ],

  providers: [
    RestaurantRepositoryImpl,
    RestaurantTypeORMRepository
  ],
  exports: [
    RestaurantRepositoryImpl
  ]
})
export class RestaurantsDataAccessModule {
}
