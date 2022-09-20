import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CreateOrderDto} from "../dto/orders/CreateOrderDto";
import {CreateOrderResponseDto} from "../dto/orders/CreateOrderResponse";
import {
  Customer,
  Order,
  OrderCreatedEvent,
  OrderDomainException,
  OrderDomainService,
  Restaurant
} from "@ordering/orders/domain";
import {OrderRepository} from "./output/repository/OrderRepository";
import {Optional} from "@ordering/common/types";
import {RestaurantRepository} from "./output/repository/RestaurantRepository";
import {CustomerRepository} from "./output/repository/CustomerRepository";
import {Logger} from "@nestjs/common";
import {OrderDataMapper} from "../mappers/OrderDataMapper";

@CommandHandler(CreateOrderDto)
export class CreateOrderCommandHandler implements ICommandHandler<CreateOrderDto> {

  private readonly logger = new Logger(CreateOrderCommandHandler.name)

  constructor(
    private readonly orderDomainService: OrderDomainService,
    private readonly orderRepository: OrderRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly restaurantRepository: RestaurantRepository,
  ) {
  }

  public async execute(command: CreateOrderDto): Promise<CreateOrderResponseDto> {

    await this.checkCustomer(command.customerId)
    const restaurant: Restaurant = await this.checkRestaurant(command)
    const order: Order = OrderDataMapper.createOrderCommandToOrder(command)
    const orderCreatedEvent: OrderCreatedEvent = this.orderDomainService.validateAndInitiateOrder(order, restaurant)
    const orderResult = await this.saveOrder(order)
    this.logger.log(`Order created with id: ${orderResult.getId()}`)

    return OrderDataMapper.orderToOrderCreateResponse(orderResult)
  }


  private async checkCustomer(customerId: string): Promise<void> {

    const customer: Optional<Customer> = await this.customerRepository.findCustomer(customerId)
    if (!customer) {
      const message = `Could not find customer with id: ${customerId}`
      throw new OrderDomainException(message)
    }
  }

  private async checkRestaurant(command: CreateOrderDto): Promise<Restaurant> {

    const restaurant: Restaurant = OrderDataMapper.createOrderCommandToRestaurant(command)

    const dbRestaurant: Optional<Restaurant> = await this.restaurantRepository.findRestaurantInformation(restaurant)
    if (!dbRestaurant) {
      const message = `Could not find customer with id: ${restaurant.getId()}`
      throw new OrderDomainException(message)
    }

    return restaurant;
  }

  private async saveOrder(order: Order): Promise<Order> {

    const orderSaveResult: Order = await this.orderRepository.save(order)

    if (!orderSaveResult) {
      throw new OrderDomainException("Could not save order")
    }
    return orderSaveResult;
  }
}
