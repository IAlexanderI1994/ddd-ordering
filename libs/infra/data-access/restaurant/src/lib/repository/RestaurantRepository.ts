import {IRestaurantRepository} from "./interfaces/IRestaurantRepository";
import {RestaurantEntity} from "../entity/RestaurantEntity";
import {InjectRepository as TypeORMRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";

@Injectable()
export class RestaurantTypeORMRepository implements IRestaurantRepository {

  constructor(
    @TypeORMRepository(RestaurantEntity)
    private restaurantEntityRepository: Repository<RestaurantEntity>
  ) {
  }

  async findByRestaurantIdAndProductIdIn(restaurantId: string, productIds: string[]): Promise<RestaurantEntity[]> {
    return await this.restaurantEntityRepository.findBy({
      restaurantId,
      productId: In(productIds)
    })
  }

}
