import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CreateOrderKafkaMessagePublisher} from "@delivery/orders/messaging";
import {CreateOrderCommand, OrderDataMapper, CreateOrderResponseDto, CreateOrderHelper} from "@delivery/orders/application";
import {OrderCreatedEvent} from "@delivery/orders/domain";

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
