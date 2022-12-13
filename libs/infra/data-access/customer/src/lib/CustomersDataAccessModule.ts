import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common"
import {CustomerEntity} from "./entity/CustomerEntity";
import {CustomerRepositoryImpl} from "@delivery/infra/data-access/customer";

const entities =  [CustomerEntity]
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
