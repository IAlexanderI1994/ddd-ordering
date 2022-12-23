import {INestApplication, Logger} from "@nestjs/common";

import {Repository} from "typeorm";

import {CustomerEntity} from "@delivery/infra/data-access/customer";
import {RestaurantEntity, RestaurantProductsEntity, RestaurantViewEntity} from "@delivery/infra/data-access/restaurant";
import {ProductEntity} from "@delivery/infra/data-access/restaurant";
import {getRepositoryToken} from "@nestjs/typeorm";

type SeedingResult = {
  customerId: string;
  restaurantId: string;
  productId: string;
}

export class OrderingProcessDataSeeder {

  private readonly logger = new Logger(OrderingProcessDataSeeder.name)

  constructor(
    private customerEntityRepository: Repository<CustomerEntity>,
    private restaurantEntityRepository: Repository<RestaurantEntity>,
    private productEntityRepository: Repository<ProductEntity>,
    private restaurantViewEntityRepository: Repository<RestaurantViewEntity>,
    private restaurantProductsEntityRepository: Repository<RestaurantProductsEntity>,
  ) {
  }

  async seed(): Promise<SeedingResult> {

    await this.customerEntityRepository.clear()
    await this.restaurantEntityRepository.clear()
    await this.productEntityRepository.clear()
    try {

      const {id: customerId}: CustomerEntity = await this.customerEntityRepository.save({
        name: 'Test1'
      })
      const {id: restaurantId}: RestaurantEntity = await this.restaurantEntityRepository.save({
        name: 'res1',
        active: true
      })

      const {id: productId}: ProductEntity = await this.productEntityRepository.save({
        name: 'p1',
        price: 500,
        available: true
      })
      await this.restaurantProductsEntityRepository.save({
        productId,
        restaurantId
      })

      return {customerId, restaurantId, productId}
    } catch (e) {
      this.logger.error(e.message)
      console.error(e)
      return null;
    }

  }

  static async create(app: INestApplication): Promise<OrderingProcessDataSeeder> {
    const customerEntityRepository = await app.resolve(getRepositoryToken(CustomerEntity))
    const restaurantEntityRepository = await app.resolve(getRepositoryToken(RestaurantEntity))
    const productEntityRepository = await app.resolve(getRepositoryToken(ProductEntity))
    const restaurantProductsEntityRepository = await app.resolve(getRepositoryToken(RestaurantProductsEntity))
    const restaurantViewEntityRepository = await app.resolve(getRepositoryToken(RestaurantViewEntity))

    return new OrderingProcessDataSeeder(customerEntityRepository, restaurantEntityRepository, productEntityRepository, restaurantViewEntityRepository, restaurantProductsEntityRepository)
  }
}
