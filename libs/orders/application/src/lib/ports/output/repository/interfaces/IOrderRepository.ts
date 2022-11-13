import {Order} from "@delivery/orders/domain";
import {Optional} from "@delivery/common/types";
import {TrackingId} from "@delivery/common/domain";

export interface IOrderRepository {

  save(order: Order): Order;

  findByTrackingId(trackingId: TrackingId): Optional<Order>

}
