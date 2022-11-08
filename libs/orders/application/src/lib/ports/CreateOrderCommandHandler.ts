import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CreateOrderCommand} from "../dto/orders/CreateOrderCommand";
import {CreateOrderResponseDto} from "../dto/orders/CreateOrderResponse";
import {OrderDataMapper} from "../mappers/OrderDataMapper";
import {CreateOrderHelper} from "./output/CreateOrderHelper";
import {OrderCreatedEvent} from "@ordering/orders/domain";
import {CreateOrderKafkaMessagePublisher} from "@ordering/orders/messaging";

@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler implements ICommandHandler<CreateOrderCommand> {

  constructor(
    private readonly createOrderHelper: CreateOrderHelper,
    private readonly applicationDomainEventPublisher: CreateOrderKafkaMessagePublisher
  ) {
  }

  public async execute(command: CreateOrderCommand): Promise<CreateOrderResponseDto> {

    const orderCreatedEvent: OrderCreatedEvent = await this.createOrderHelper.persistOrder(command)

    await this.applicationDomainEventPublisher.publish(orderCreatedEvent)
    return OrderDataMapper.orderToOrderCreateResponse(orderCreatedEvent.order)
  }

}
