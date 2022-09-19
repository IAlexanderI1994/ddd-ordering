import {OrderDomainServiceInterface} from "./order-domain.service.interface";
import {Order} from "../entity/order";
import {Restaurant} from "../entity/restaurant";
import {OrderCreatedEvent} from "../events/order-created.event";
import {OrderCancelledEvent} from "../events/order-cancelled.event";
import {OrderPaidEvent} from "../events/order-paid.event";
import {Logger} from "@nestjs/common";
import {OrderDomainException} from "../exception/order-domain.exception";
import {Product} from "../entity/product";


export class OrderDomainService implements OrderDomainServiceInterface {

  private readonly logger = new Logger(OrderDomainService.name)

  approveOrder(order: Order): void {
    order.approve()
    this.logger.log(`Order with ID: ${order.getId().getValue()} is approved`)
  }

  cancelOrder(order: Order, failureMessages: string[]): void {

    order.cancel(failureMessages)
    this.logger.log(`Order with  ID: ${order.getId().getValue()} is cancelled`)


  }

  cancelOrderPayment(order: Order, failureMessages: string[]): OrderCancelledEvent {
    order.initCancel(failureMessages)
    this.logger.log(`Order payment cancelling for Order  ID: ${order.getId().getValue()}`)
    return new OrderCancelledEvent(order, (new Date).toISOString())
  }

  payOrder(order: Order): OrderPaidEvent {
    order.pay()
    this.logger.log(`Order with ID: ${order.getId().getValue()} is paid`)

    return new OrderPaidEvent(order, (new Date).toISOString())
  }

  validateAndInitiateOrder(order: Order, restaurant: Restaurant): OrderCreatedEvent {

    this.validateRestaurant(restaurant)
    this.setOrderProductInformation(order, restaurant)
    order.validateOrder()
    order.initialize()

    this.logger.log(`Order with ${order.getId().getValue()} is initiated`)

    return new OrderCreatedEvent(order, (new Date).toISOString());
  }

  private validateRestaurant(restaurant: Restaurant) {

    if (!restaurant.isActive) {
      throw new OrderDomainException(`Restaurant with id ${restaurant.getId().getValue()} is currently not active`)
    }

  }

  private setOrderProductInformation(order: Order, restaurant: Restaurant) {

    order.items.forEach(
      orderItem => restaurant.products.forEach(
        restaurantProduct => {
          const currentProduct: Product = orderItem.product
          if (currentProduct.equals(restaurantProduct)) {
            currentProduct.updateWithConfirmedNameAndPrice(restaurantProduct.name, restaurantProduct.price)
          }


        }
      )
    )
  }
}
