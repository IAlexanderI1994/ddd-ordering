import {Optional} from "@delivery/common/types";
import {Restaurant} from "@delivery/orders/domain";

export interface IRestaurantRepository {


  findRestaurantInformation(restaurant: Restaurant): Promise<Optional<Restaurant>>


}
