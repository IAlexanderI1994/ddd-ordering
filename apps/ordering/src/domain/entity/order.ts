import {AggregateRoot, CustomerId, Money, OrderId, RestaurantId, StreetAddress} from "@ordering/common/domain";
import {OrderItem} from "./order-item";

export class Order extends AggregateRoot<OrderId> {

  private readonly customerId: CustomerId;
  private readonly restaurantId: RestaurantId;
  private readonly deliveryAddress: StreetAddress;
  private readonly price: Money;
  private readonly items: OrderItem[];



}
