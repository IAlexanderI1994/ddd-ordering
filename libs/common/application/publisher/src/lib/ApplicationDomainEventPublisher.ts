import { IDomainEventPublisher } from '@ordering/common/domain';
import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export abstract class ApplicationDomainEventPublisher<T>
  implements IDomainEventPublisher<T>
{
  protected constructor(protected readonly eventBus: EventBus) {}

  abstract publish(domainEvent: T): Promise<void>;
}
