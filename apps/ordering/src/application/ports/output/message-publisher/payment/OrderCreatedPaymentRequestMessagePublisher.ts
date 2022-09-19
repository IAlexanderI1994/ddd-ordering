import {IDomainEventPublisher} from "@ordering/common/domain";
import {OrderCreatedEvent} from "@ordering/orders/domain";

export interface OrderCreatedPaymentRequestMessagePublisher extends IDomainEventPublisher<OrderCreatedEvent>{

}
