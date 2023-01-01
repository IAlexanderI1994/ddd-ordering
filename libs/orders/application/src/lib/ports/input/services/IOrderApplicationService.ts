import {CreateOrderResponseDto} from "../../../dto/orders/CreateOrderResponse";
import {ExtendedOrderCommandDto} from "../../../dto/orders/ExtendedOrderCommandDto";
import {TrackOrderQuery} from "../../../dto/track/TrackOrder";
import {TrackOrderResponseDto} from "../../../dto/track/TrackOrderResponse";

export interface IOrderApplicationService {

  createOrder(orderDTO: ExtendedOrderCommandDto): Promise<CreateOrderResponseDto>;

  trackOrder(trackDTO: TrackOrderQuery): Promise<TrackOrderResponseDto>;
}
