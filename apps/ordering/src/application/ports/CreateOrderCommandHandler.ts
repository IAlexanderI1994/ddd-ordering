import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CreateOrderDto} from "../dto/orders/CreateOrderDto";
import {CreateOrderResponseDto} from "../dto/orders/CreateOrderResponse";
import {OrderDataMapper} from "../mappers/OrderDataMapper";
import {CreateOrderHelper} from "./output/CreateOrderHelper";
import {OrderCreatedEvent} from "@ordering/orders/domain";
import {
  OrderCreatedPaymentRequestMessagePublisher
} from "./output/message-publisher/OrderCreatedPaymentRequestMessagePublisher";


@CommandHandler(CreateOrderDto)
export class CreateOrderCommandHandler implements ICommandHandler<CreateOrderDto> {

  constructor(
    private readonly createOrderHelper: CreateOrderHelper,
    private readonly applicationDomainEventPublisher: OrderCreatedPaymentRequestMessagePublisher
  ) {
  }

  public async execute(command: CreateOrderDto): Promise<CreateOrderResponseDto> {

    const orderCreatedEvent: OrderCreatedEvent = await this.createOrderHelper.persistOrder(command)

    await this.applicationDomainEventPublisher.publish(orderCreatedEvent)
    return OrderDataMapper.orderToOrderCreateResponse(orderCreatedEvent.order)
  }

}
