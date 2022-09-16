import {Restaurant} from "../entity/restaurant";
import {Order} from "../entity/order";
import {OrderCreatedEvent} from "../events/order-created.event";
import {OrderPaidEvent} from "../events/order-paid.event";
import {OrderCancelledEvent} from "../events/order-cancelled.event";

export interface OrderDomainServiceInterface {

  validateAndInitiateOrder(order: Order, restaurant: Restaurant): OrderCreatedEvent;

  payOrder(order: Order): OrderPaidEvent

  approveOrder(order: Order): void;

  cancelOrderPayment(order: Order, failureMessages: string[]): OrderCancelledEvent

  cancelOrder(order: Order, failureMessages: string[]): void;

}
