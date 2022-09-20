import {Optional} from "@ordering/common/types";
import {Restaurant} from "@ordering/orders/domain";

export interface IRestaurantRepository {

  save(order: Restaurant): Restaurant;

  findRestaurantInformation(restaurant: Restaurant): Optional<Restaurant>


}
