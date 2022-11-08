import {Optional} from "@ordering/common/types";
import {Order} from "@ordering/orders/domain";
import {TrackingId} from "@ordering/common/domain";

export interface IOrderRepository {

  findByTrackingId(trackingId: TrackingId): Promise<Optional<Order>>

  save(order: Order): Promise<Order>
}
