import { IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {Logger} from "@nestjs/common";
import {TrackOrderQuery, TrackOrderResponseDto} from "@delivery/orders/application";
import {TrackingId} from "@delivery/common/domain";
import {OrderRepositoryImpl} from "@delivery/infra/data-access/orders";
import {Order, OrderNotFoundException} from "@delivery/orders/domain";
import {OrderDataMapper} from "../../../mappers/OrderDataMapper";


@QueryHandler(TrackOrderQuery)
export class OrderTrackQueryHandler implements IQueryHandler<TrackOrderQuery>{


  private readonly logger = new Logger(OrderTrackQueryHandler.name)
  constructor(
    private readonly orderRepository: OrderRepositoryImpl
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
