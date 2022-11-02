import {OrderStatus} from "@ordering/common/domain";
import {IKafkaHandler} from "../types";

export type PaymentResponseAvroModelData = {
  id: string;
  sagaId: string;
  paymentId: string;
  customerId: string;
  orderId: string;
  price: number;
  createdAt: string;
  paymentOrderStatus: OrderStatus
  failureMessages: string[];
}
export class PaymentResponseHandler implements IKafkaHandler{
  handle(event: PaymentResponseAvroModelData): any {
    console.log(event)
  }
}
