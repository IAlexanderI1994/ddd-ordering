import { CreateOrderDto } from "../dto/orders/CreateOrderDto";
import { CreateOrderResponseDto } from "../dto/orders/CreateOrderResponse";
import { TrackOrderDto } from "../dto/track/TrackOrder";
import { TrackOrderResponseDto } from "../dto/track/TrackOrderResponse";
import {IOrderApplicationService} from "./input/services/IOrderApplicationService";
import {Injectable} from "@nestjs/common";
import {CreateOrderCommandHandler} from "./CreateOrderCommandHandler";
import {OrderTrackQueryHandler} from "./OrderTrackQueryHandler";


@Injectable()
export class OrderApplicationService implements IOrderApplicationService {

  constructor(
    private readonly createOrderCommandHandler: CreateOrderCommandHandler,
    private readonly orderTrackCommandHandler: OrderTrackQueryHandler,

    ) {
  }
    async createOrder(orderDTO: CreateOrderDto): Promise<CreateOrderResponseDto> {
       return await this.createOrderCommandHandler.execute(orderDTO)
    }
    async trackOrder(trackDTO: TrackOrderDto): Promise<TrackOrderResponseDto> {
      return await this.orderTrackCommandHandler.execute(trackDTO)
    }

}
