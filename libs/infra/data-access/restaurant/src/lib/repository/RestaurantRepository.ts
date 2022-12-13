import {IRestaurantRepository} from "./interfaces/IRestaurantRepository";
import {InjectRepository as TypeORMRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import { RestaurantViewEntity } from "../entity/RestaurantViewEntity";

@Injectable()
export class RestaurantTypeORMRepository implements IRestaurantRepository {

  constructor(
    @TypeORMRepository(RestaurantViewEntity)
    private restaurantEntityRepository: Repository<RestaurantViewEntity>
  ) {
  }

  async findByRestaurantIdAndProductIdIn(restaurantId: string, productIds: string[]): Promise<RestaurantViewEntity[]> {
    return await this.restaurantEntityRepository.findBy({
      restaurantId,
      productId: In(productIds)
    })
  }

}
