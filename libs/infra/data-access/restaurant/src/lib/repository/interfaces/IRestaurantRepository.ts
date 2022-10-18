import {RestaurantEntity} from "../../entity/RestaurantEntity";

export interface IRestaurantRepository {
  findByRestaurantIdAndProductIdIn(restaurantId: string, productIds: string[]): Promise<RestaurantEntity[]>
}
