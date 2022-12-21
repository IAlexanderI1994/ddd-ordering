import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common"
import {CustomerEntityView} from "./entity/CustomerEntityView";
import {CustomerEntity} from "./entity/CustomerEntity";
import {CustomerRepositoryImpl} from "./repository/CustomerRepositoryImpl";

const entities =  [CustomerEntityView, CustomerEntity]
@Module({
  imports: [
    TypeOrmModule.forFeature(entities)
  ],

  providers: [
    CustomerRepositoryImpl
  ],
  exports: [
    CustomerRepositoryImpl
  ]
})
export class CustomersDataAccessModule {
}
