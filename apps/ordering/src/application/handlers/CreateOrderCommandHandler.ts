import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CreateOrderKafkaMessagePublisher} from "@delivery/orders/messaging";
import {ExtendedCreateOrderCommandDto, OrderDataMapper, CreateOrderResponseDto, CreateOrderHelper} from "@delivery/orders/application";
import {OrderCreatedEvent} from "@delivery/orders/domain";

@CommandHandler(ExtendedCreateOrderCommandDto)
export class CreateOrderCommandHandler implements ICommandHandler<ExtendedCreateOrderCommandDto> {

  constructor(
    private readonly createOrderHelper: CreateOrderHelper,
    private readonly applicationDomainEventPublisher: CreateOrderKafkaMessagePublisher
  ) {
  }

  public async execute(command: ExtendedCreateOrderCommandDto): Promise<CreateOrderResponseDto> {

    const orderCreatedEvent: OrderCreatedEvent = await this.createOrderHelper.persistOrder(command)

    await this.applicationDomainEventPublisher.publish(orderCreatedEvent)
    return OrderDataMapper.orderToOrderCreateResponse(orderCreatedEvent.order)
  }

}
