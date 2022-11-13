import {IDomainEventPublisher} from "@delivery/common/domain";
import {OrderCreatedEvent} from "@delivery/orders/domain";

export interface IOrderCreatedPaymentRequestMessagePublisher extends IDomainEventPublisher<OrderCreatedEvent>{

}
