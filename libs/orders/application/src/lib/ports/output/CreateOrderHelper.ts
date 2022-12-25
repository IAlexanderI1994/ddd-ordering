import {
  Customer,
  Order,
  OrderCreatedEvent,
  OrderDomainException,
  OrderDomainService,
  Restaurant
} from "@delivery/orders/domain";
import {OrderDataMapper} from "../../mappers/OrderDataMapper";
import {Optional} from "@delivery/common/types";
import {Injectable, Logger} from "@nestjs/common";
import {OrderRepositoryImpl} from "@delivery/infra/data-access/orders";
import {
  CustomerRepositoryImpl
} from "@delivery/infra/data-access/customer";
import {RestaurantRepositoryImpl} from "@delivery/infra/data-access/restaurant";
import { CreateOrderCommand } from "../../dto/orders/CreateOrderCommand";


@Injectable()
export class CreateOrderHelper {

  private readonly logger = new Logger(CreateOrderHelper.name)

  constructor(
    private readonly orderDomainService: OrderDomainService,
    private readonly orderRepository: OrderRepositoryImpl,
    private readonly customerRepository: CustomerRepositoryImpl,
    private readonly restaurantRepository: RestaurantRepositoryImpl,
  ) {
  }

  //todo: make transactional
  public async persistOrder(command: CreateOrderCommand): Promise<OrderCreatedEvent> {
    await this.checkCustomer(command.customerId)
    const restaurant: Restaurant = await this.checkRestaurant(command)
    const order: Order = OrderDataMapper.createOrderCommandToOrder(command)
    const orderCreatedEvent: OrderCreatedEvent = this.orderDomainService.validateAndInitiateOrder(order, restaurant)
    this.logger.log(`Order created with id: ${orderCreatedEvent.order.getId()}`)
    await this.saveOrder(order)

    return orderCreatedEvent
  }

  private async checkCustomer(customerId: string): Promise<void> {

    const customer: Optional<Customer> = await this.customerRepository.findCustomer(customerId)
    if (!customer) {
      const message = `Could not find customer with id: ${customerId}`
      throw new OrderDomainException(message)
    }
  }

  private async checkRestaurant(command: CreateOrderCommand): Promise<Restaurant> {

    const restaurant: Restaurant = OrderDataMapper.createOrderCommandToRestaurant(command)

    const dbRestaurant: Optional<Restaurant> = await this.restaurantRepository.findRestaurantInformation(restaurant)
    if (!dbRestaurant) {
      const message = `Could not find restaurant with id: ${restaurant.getId()}`
      throw new OrderDomainException(message)
    }

    return dbRestaurant;
  }

  private async saveOrder(order: Order): Promise<Order> {

    const orderSaveResult: Order = await this.orderRepository.save(order)

    if (!orderSaveResult) {
      throw new OrderDomainException("Could not save order")
    }
    return orderSaveResult;
  }
}
