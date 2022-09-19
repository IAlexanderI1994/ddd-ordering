import {Optional} from "@ordering/common/types";
import {Order, Restaurant} from "@ordering/orders/domain";

export interface IRestaurantRepository {

  save(order: Order): Order;

  findRestaurantInformation(restaurant: Restaurant): Optional<Restaurant>


}
