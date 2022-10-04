import {Optional} from "@ordering/common/types";
import {OrderEntity} from "../../entity/OrderEntity";
import {Order} from "@ordering/orders/domain";

export interface IOrderRepository {

  findByTrackingId(trackingId: string): Promise<Optional<Order>>

  save(order: Order): Promise<Order>
}
