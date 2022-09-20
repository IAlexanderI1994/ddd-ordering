import { TrackingId } from "@ordering/common/domain";
import { Order } from "@ordering/orders/domain";
import {IOrderRepository} from "./interfaces/IOrderRepository";

export class OrderRepository implements IOrderRepository {
    save(order: Order): Order {
        throw new Error("Method not implemented.");
    }
    findByTrackingId(trackingId: TrackingId): Order {
        throw new Error("Method not implemented.");
    }

}
