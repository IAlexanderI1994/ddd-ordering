import {Optional} from "@ordering/common/types";
import {Restaurant} from "@ordering/orders/domain";

export interface IRestaurantRepository {


  findRestaurantInformation(restaurant: Restaurant): Promise<Optional<Restaurant>>


}
