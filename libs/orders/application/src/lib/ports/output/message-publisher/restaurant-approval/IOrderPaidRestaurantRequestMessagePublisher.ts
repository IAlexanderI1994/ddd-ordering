import {IDomainEventPublisher} from "@delivery/common/domain";
import {OrderPaidEvent} from "@delivery/orders/domain";

export interface IOrderPaidRestaurantRequestMessagePublisher extends IDomainEventPublisher<OrderPaidEvent>{

}
