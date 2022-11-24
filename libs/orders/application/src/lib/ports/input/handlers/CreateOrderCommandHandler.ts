import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CreateOrderCommand} from "@delivery/orders/application";
import {OrderRepositoryImpl} from "@delivery/infra/data-access/orders";

@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler implements ICommandHandler{

  constructor(private readonly orderRepository: OrderRepositoryImpl) {
  }
  execute(command: CreateOrderCommand): Promise<any> {
    console.log(this.orderRepository, command)
    return Promise.resolve(undefined);
  }



}
