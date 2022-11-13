import {IDomainEventPublisher} from "@delivery/common/domain";
import {OrderCancelledEvent} from "@delivery/orders/domain";

export interface IOrderCancelledPaymentRequestMessagePublisher extends IDomainEventPublisher<OrderCancelledEvent>{

}
