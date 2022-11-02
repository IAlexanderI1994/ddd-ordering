import {OrderStatus} from "@ordering/common/domain";
import {IKafkaHandler} from "../types";

export type PaymentRequestAvroModel = {
  id: string;
  sagaId: string;
  customerId: string;
  orderId: string;
  price: number;
  createdAt: string;
  paymentOrderStatus: OrderStatus

}
export class PaymentRequestHandler implements IKafkaHandler{
  handle(event: PaymentRequestAvroModel): any {
    console.log({event})
  }
}
