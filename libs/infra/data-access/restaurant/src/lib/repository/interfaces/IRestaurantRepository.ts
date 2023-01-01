import {RestaurantViewEntity} from "../../entity/RestaurantViewEntity";

export interface IRestaurantRepository {
  findByRestaurantIdAndProductIdIn(restaurantId: string, productIds: string[]): Promise<RestaurantViewEntity[]>
}
