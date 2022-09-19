import {IDomainEventPublisher} from "@ordering/common/domain";
import {OrderCancelledEvent} from "@ordering/orders/domain";

export interface OrderCreatedPaymentRequestMessagePublisher extends IDomainEventPublisher<OrderCancelledEvent>{

}
