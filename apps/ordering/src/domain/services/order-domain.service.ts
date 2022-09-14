import {Restaurant} from "../entity/restaurant";
import {Order} from "../entity/order";
import {OrderCreatedEvent} from "../events/order-created.event";
import {OrderPaidEvent} from "../events/order-paid.event";
import {OrderCancelledEvent} from "../events/order-cancelled.event";

export interface OrderDomainService {

  validateAndInitiateOrder( order: Order, restaurant: Restaurant): OrderCreatedEvent;
  payOrder(order: Order): OrderPaidEvent
  approveOrder(order: Order): void;
  cancelOrder(order: Order, failureMessages: string[]): void;


}
