import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {PaymentRequestAvroModel} from "@ordering/infra/kafka";

@EventsHandler(PaymentRequestAvroModel)
export class PaymentRequestHandler implements IEventHandler<PaymentRequestAvroModel>{
  handle(event: PaymentRequestAvroModel): any {
    console.log({event})
  }
}
