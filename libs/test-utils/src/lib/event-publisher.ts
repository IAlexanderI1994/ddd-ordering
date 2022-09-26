import { AggregateRoot, EventPublisher } from "@nestjs/cqrs";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TestingEventPublisher extends AggregateRoot {
  constructor(
    private publisher: EventPublisher
  ) {
    super();
    this.publisher.mergeObjectContext(this);
  }

  async publish(event: any) {
    await new Promise(r => {
      setTimeout(() => {
        this.apply(event);
        this.commit();
        console.log('here')
        r(1);
      }, 2000);

    });
  }


}
