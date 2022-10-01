import {Controller, Logger} from '@nestjs/common';
import {OrderApplicationService} from "../ports/OrderApplicationService";
import {CreateOrderCommand} from "../dto/orders/CreateOrderCommand";
import {CreateOrderResponseDto} from "../dto/orders/CreateOrderResponse";
import { MessagePattern } from '@nestjs/microservices';
import {CREATE_ORDER_COMMAND, GET_ORDER_BY_TRACKING_ID} from "../constants/controller-patterns";
import {TrackOrderResponseDto} from "../dto/track/TrackOrderResponse";
import {TrackOrderQuery} from "../dto/track/TrackOrder";

@Controller()
export class OrderController {

  private readonly logger = new Logger(OrderController.name)

  constructor(
    private readonly orderApplicationService: OrderApplicationService,
  ) {
  }

  @MessagePattern(CREATE_ORDER_COMMAND)
  public async createOrder(createOrderCommand: CreateOrderCommand): Promise<CreateOrderResponseDto> {

    this.logger.log(`Creating order for customer ${createOrderCommand.customerId} and restaurant ${createOrderCommand.restaurantId}`)
    const createOrderResponse: CreateOrderResponseDto = await this.orderApplicationService.createOrder(createOrderCommand)

    this.logger.log(`Order created with tracking ID: ${createOrderResponse.orderTrackingId}`)

    return createOrderResponse;
  }

  @MessagePattern(GET_ORDER_BY_TRACKING_ID)
  public async getOrderByTrackingId(trackOrderQuery: TrackOrderQuery): Promise<TrackOrderResponseDto> {

    const trackOrderResponse: TrackOrderResponseDto = await this.orderApplicationService.trackOrder(trackOrderQuery)
    this.logger.log(`Returning order status with tracking id: ${trackOrderQuery.orderTrackingId}`)

    return trackOrderResponse
  }


}
