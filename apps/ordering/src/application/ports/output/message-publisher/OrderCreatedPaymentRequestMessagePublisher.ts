import {ApplicationDomainEventPublisher} from "@ordering/common/application/publisher";
import {OrderCreatedEvent} from "@ordering/orders/domain";

export class OrderCreatedPaymentRequestMessagePublisher extends ApplicationDomainEventPublisher<OrderCreatedEvent>{
  async publish(domainEvent: OrderCreatedEvent): Promise<void> {
    await super.eventBus.publish(domainEvent)
  }

}
