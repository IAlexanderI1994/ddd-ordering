import {Logger} from "@nestjs/common";

import {Repository} from "typeorm";

import {CustomerEntity} from "@delivery/infra/data-access/customer";
import {RestaurantEntity} from "@delivery/infra/data-access/restaurant";

type SeedingResult = {
  customerId: string;
  restaurantId: string;
}

export class OrderingProcessDataSeeder {

  private readonly logger = new Logger(OrderingProcessDataSeeder.name)

  constructor(
    private customerEntityRepository: Repository<CustomerEntity>,
    private restaurantEntityRepository: Repository<RestaurantEntity>
  ) {
  }

  async seed(): Promise<SeedingResult> {

    await this.customerEntityRepository.clear()
    await this.restaurantEntityRepository.clear()
    try {

      const {id: customerId}: CustomerEntity = await this.customerEntityRepository.save({
        name: 'Test1'
      })
      const {id: restaurantId}: RestaurantEntity = await this.restaurantEntityRepository.save({
        name: 'res1',
        active: true
      })

      return {customerId, restaurantId}
    } catch (e) {
      this.logger.error(e.message)
      console.error(e)
      return null;
    }

  }
}
