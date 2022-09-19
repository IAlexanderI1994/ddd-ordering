import {IDomainEvent} from "@ordering/common/domain";

export interface IDomainEventPublisher<T extends IDomainEvent<T>> {
  publish(domainEvent: T): void;
}
