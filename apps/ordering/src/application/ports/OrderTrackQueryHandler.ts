import { IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {TrackOrderQuery} from "../dto/track/TrackOrder";
import {TrackOrderResponseDto} from "../dto/track/TrackOrderResponse";
import {OrderRepository} from "./output/repository/OrderRepository";
import {TrackingId} from "@ordering/common/domain";
import {Order, OrderNotFoundException} from "@ordering/orders/domain";
import {Logger} from "@nestjs/common";
import {OrderDataMapper} from "../mappers/OrderDataMapper";


@QueryHandler(TrackOrderQuery)
export class OrderTrackQueryHandler implements IQueryHandler<TrackOrderQuery>{


  private readonly logger = new Logger(OrderTrackQueryHandler.name)
  constructor(
    private readonly orderRepository: OrderRepository
  ) {}


  public async execute(query: TrackOrderQuery): Promise<TrackOrderResponseDto> {
    const orderSearchResult: Order = await this.orderRepository.findByTrackingId(new TrackingId(query.orderTrackingId))

    if ( !orderSearchResult) {
      this.logger.warn(`Could not find order with tracking id: ${query.orderTrackingId}`)
      throw new OrderNotFoundException()
    }
    return OrderDataMapper.orderToTrackOrderResponse(orderSearchResult)
  }
}
