import {IDomainEventPublisher} from "@ordering/common/domain";
import {OrderCreatedEvent} from "@ordering/orders/domain";

export interface IOrderCreatedPaymentRequestMessagePublisher extends IDomainEventPublisher<OrderCreatedEvent>{

}
