import {CreateOrderCommand} from "../dto/orders/CreateOrderCommand";
import {CreateOrderResponseDto} from "../dto/orders/CreateOrderResponse";
import {TrackOrderQuery} from "../dto/track/TrackOrder";
import {TrackOrderResponseDto} from "../dto/track/TrackOrderResponse";
import {IOrderApplicationService} from "./input/services/IOrderApplicationService";
import {Injectable} from "@nestjs/common";
import {CommandBus, QueryBus} from "@nestjs/cqrs";

@Injectable()
export class OrderApplicationService implements IOrderApplicationService {

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {
  }

  async createOrder(createOrderCommand: CreateOrderCommand): Promise<CreateOrderResponseDto> {
    return await this.commandBus.execute(createOrderCommand)
  }

  async trackOrder(trackOrderQuery: TrackOrderQuery): Promise<TrackOrderResponseDto> {
    return await this.queryBus.execute(trackOrderQuery)
  }

}
