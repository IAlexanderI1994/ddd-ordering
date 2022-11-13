import {Optional} from "@delivery/common/types";
import {Order} from "@delivery/orders/domain";
import {TrackingId} from "@delivery/common/domain";

export interface IOrderRepository {

  findByTrackingId(trackingId: TrackingId): Promise<Optional<Order>>

  save(order: Order): Promise<Order>
}
