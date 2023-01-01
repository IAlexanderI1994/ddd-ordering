import {Body, Controller, Logger, Post} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {
  OrderApplicationService,
  TrackOrderResponseDto,
  ExtendedCreateOrderCommandDto,
  CreateOrderResponseDto,
  TrackOrderQuery
} from "@delivery/orders/application";
import {GET_ORDER_BY_TRACKING_ID} from "../constants/controller-patterns";
import {TransformCreateOrderCommandToExtendedDto} from "../pipes/TransformCreateOrderCommandToExtendedDto";

@Controller()
export class OrderController {

  private readonly logger = new Logger(OrderController.name)

  constructor(
    private readonly orderApplicationService: OrderApplicationService,
  ) {
  }

  @Post('/orders')
  public async createOrder(
    @Body(TransformCreateOrderCommandToExtendedDto) createOrderCommand: ExtendedCreateOrderCommandDto
  ): Promise<CreateOrderResponseDto> {

    this.logger.log(`Creating order for customer ${createOrderCommand.customerId} and restaurant ${createOrderCommand.restaurantId}`)

    try {
      const createOrderResponse: CreateOrderResponseDto = await this.orderApplicationService.createOrder(createOrderCommand)
      this.logger.log(`Order created with tracking ID: ${createOrderResponse.orderTrackingId}`)
      return createOrderResponse;

    } catch (e) {

      this.logger.error(e.message)
      console.error(e)
      return null;
    }


  }

  @MessagePattern(GET_ORDER_BY_TRACKING_ID)
  public async getOrderByTrackingId(trackOrderQuery: TrackOrderQuery): Promise<TrackOrderResponseDto> {

    const trackOrderResponse: TrackOrderResponseDto = await this.orderApplicationService.trackOrder(trackOrderQuery)
    this.logger.log(`Returning order status with tracking id: ${trackOrderQuery.orderTrackingId}`)

    return trackOrderResponse
  }


}
