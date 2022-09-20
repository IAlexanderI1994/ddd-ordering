import { Customer, Order, Restaurant} from "@ordering/orders/domain";
import {ICustomerRepository} from "./interfaces/ICustomerRepository";
import {IRestaurantRepository} from "./interfaces/IRestaurantRepository";

export class RestaurantRepository implements IRestaurantRepository {
    save(order: Restaurant): Restaurant {
        throw new Error("Method not implemented.");
    }
    findRestaurantInformation(restaurant: Restaurant): Restaurant {
        throw new Error("Method not implemented.");
    }
}
