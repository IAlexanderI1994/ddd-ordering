import {CreateOrderResponseDto} from "../../../dto/orders/CreateOrderResponse";
import {CreateOrderCommand} from "../../../dto/orders/CreateOrderCommand";
import {TrackOrderQuery} from "../../../dto/track/TrackOrder";
import {TrackOrderResponseDto} from "../../../dto/track/TrackOrderResponse";

export interface IOrderApplicationService {

  createOrder(orderDTO: CreateOrderCommand): Promise<CreateOrderResponseDto>;

  trackOrder(trackDTO: TrackOrderQuery): Promise<TrackOrderResponseDto>;
}
