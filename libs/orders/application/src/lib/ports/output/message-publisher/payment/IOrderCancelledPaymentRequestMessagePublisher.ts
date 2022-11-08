import {IDomainEventPublisher} from "@ordering/common/domain";
import {OrderCancelledEvent} from "@ordering/orders/domain";

export interface IOrderCancelledPaymentRequestMessagePublisher extends IDomainEventPublisher<OrderCancelledEvent>{

}
