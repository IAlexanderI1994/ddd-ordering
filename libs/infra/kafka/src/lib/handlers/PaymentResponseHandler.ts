import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {PaymentResponseAvroModel} from "../avro/models/PaymentResponseAvroModel";

@EventsHandler(PaymentResponseAvroModel)
export class PaymentResponseHandler implements IEventHandler<PaymentResponseAvroModel>{
  handle(event: PaymentResponseAvroModel): any {
    console.log(event)
  }
}
