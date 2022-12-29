import {IRestaurantRepository} from "./interfaces/IRestaurantRepository";
import {InjectEntityManager,} from "@nestjs/typeorm";
import {EntityManager, In, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {RestaurantViewEntity} from "../entity/RestaurantViewEntity";
import {TransactionsHelper} from "../../../../common/src/lib/helpers/transactions.helper";

@Injectable()
export class RestaurantTypeORMRepository implements IRestaurantRepository {

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager
  ) {
  }

  get restaurantEntityRepository(): Repository<RestaurantViewEntity> {
    const entityManager: EntityManager = TransactionsHelper.getTransactionEntityManager() || this.entityManager
    return entityManager.getRepository(RestaurantViewEntity)
  }

  async findByRestaurantIdAndProductIdIn(restaurantId: string, productIds: string[]): Promise<RestaurantViewEntity[]> {
    return await this.restaurantEntityRepository.findBy({
      restaurantId,
      productId: In(productIds)
    })
  }

}
