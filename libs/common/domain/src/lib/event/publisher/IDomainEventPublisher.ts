import {IDomainEvent} from "@delivery/common/domain";

export interface IDomainEventPublisher<T extends IDomainEvent<T>> {
  publish(domainEvent: T): void;
}
