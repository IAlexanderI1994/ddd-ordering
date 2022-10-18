import {Restaurant} from "@ordering/orders/domain";
import {Optional} from "@ordering/common/types";
import {IRestaurantRepository} from "@ordering/orders/application";
import {Injectable} from "@nestjs/common";
import {RestaurantTypeORMRepository} from "../repository/RestaurantRepository";
import {RestaurantDataAccessMapper} from "../mapper/RestaurantDataAccessMapper";
import {RestaurantEntity} from "../entity/RestaurantEntity";

@Injectable()
export class RestaurantRepositoryImpl implements IRestaurantRepository{

  constructor(
    private restaurantTypeORMRepository: RestaurantTypeORMRepository
  ) {
  }

  async findRestaurantInformation(restaurant: Restaurant): Promise<Optional<Restaurant>> {
    const restaurantProducts: string[] = RestaurantDataAccessMapper.restaurantToRestaurantProducts(restaurant)
    const restaurantEntities: RestaurantEntity[] = await this.restaurantTypeORMRepository
      .findByRestaurantIdAndProductIdIn(
        restaurant.getId().getValue(),
        restaurantProducts
      )
    return RestaurantDataAccessMapper.restaurantEntitiesToRestaurant(restaurantEntities)


  }


}
