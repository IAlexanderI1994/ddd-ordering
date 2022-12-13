import {Restaurant} from "@delivery/orders/domain";
import {Optional} from "@delivery/common/types";
import {IRestaurantRepository} from "@delivery/orders/application";
import {Injectable} from "@nestjs/common";
import {RestaurantTypeORMRepository} from "../repository/RestaurantRepository";
import {RestaurantDataAccessMapper} from "../mapper/RestaurantDataAccessMapper";
import {RestaurantViewEntity} from "../entity/RestaurantViewEntity";

@Injectable()
export class RestaurantRepositoryImpl implements IRestaurantRepository{

  constructor(
    private restaurantTypeORMRepository: RestaurantTypeORMRepository
  ) {
  }

  async findRestaurantInformation(restaurant: Restaurant): Promise<Optional<Restaurant>> {
    const restaurantProducts: string[] = RestaurantDataAccessMapper.restaurantToRestaurantProducts(restaurant)
    const restaurantEntities: RestaurantViewEntity[] = await this.restaurantTypeORMRepository
      .findByRestaurantIdAndProductIdIn(
        restaurant.getId().getValue(),
        restaurantProducts
      )
    return RestaurantDataAccessMapper.restaurantEntitiesToRestaurant(restaurantEntities)


  }


}
