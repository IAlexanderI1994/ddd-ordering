import {CreateOrderResponseDto} from "../../../dto/orders/CreateOrderResponse";
import {CreateOrderDto} from "../../../dto/orders/CreateOrderDto";
import {TrackOrderDto} from "../../../dto/track/TrackOrder";
import {TrackOrderResponseDto} from "../../../dto/track/TrackOrderResponse";

export interface IOrderApplicationService {

  createOrder(orderDTO: CreateOrderDto): CreateOrderResponseDto;

  trackOrder(trackDTO: TrackOrderDto): TrackOrderResponseDto;
}
