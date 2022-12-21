import {InjectRepository as TypeORMRepository} from "@nestjs/typeorm";
import {CustomerEntity, CustomerEntityView} from "@delivery/infra/data-access/customer";
import {Repository} from "typeorm";
import {Injectable, Logger} from "@nestjs/common";
import {RestaurantEntity} from "@delivery/infra/data-access/restaurant";

type SeedingResult = {
  customerId: string;
  restaurantId: string;
}

@Injectable()
export class OrderingProcessDataSeeder {

  private readonly logger = new Logger(OrderingProcessDataSeeder.name)
  constructor(
    @TypeORMRepository(CustomerEntityView)
    private customerEntityRepository: Repository<CustomerEntity>,
    @TypeORMRepository(RestaurantEntity)
    private restaurantEntityRepository: Repository<RestaurantEntity>
  ) {
  }

  async seed(): Promise<SeedingResult> {

    try {

      const {id: customerId}: CustomerEntity = await this.customerEntityRepository.save({
        name: 'Test1'
      })
      const {id: restaurantId} = await this.restaurantEntityRepository.save({
        name: 'res1',
        active: true
      })

      return { customerId, restaurantId}
    }
    catch (e) {
      this.logger.error(e.message)
      console.error(e)
    }

  }
}
