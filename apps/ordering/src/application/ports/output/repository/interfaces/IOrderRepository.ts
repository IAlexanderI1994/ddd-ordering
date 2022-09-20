import {Order} from "@ordering/orders/domain";
import {Optional} from "@ordering/common/types";
import {TrackingId} from "@ordering/common/domain";

export interface IOrderRepository {

  save(order: Order): Order;

  findByTrackingId(trackingId: TrackingId): Optional<Order>

}
