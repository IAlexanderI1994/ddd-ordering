import {CreateOrderResponseDto} from "../../../dto/orders/CreateOrderResponse";
import {CreateOrderDto} from "../../../dto/orders/CreateOrderDto";
import {TrackOrderDto} from "../../../dto/track/TrackOrder";
import {TrackOrderResponseDto} from "../../../dto/track/TrackOrderResponse";

export interface IOrderApplicationService {

  createOrder(orderDTO: CreateOrderDto): Promise<CreateOrderResponseDto>;

  trackOrder(trackDTO: TrackOrderDto): Promise<TrackOrderResponseDto>;
}
