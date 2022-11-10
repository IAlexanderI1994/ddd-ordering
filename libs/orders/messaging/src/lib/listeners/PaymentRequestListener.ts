import {OrderStatus} from "@ordering/common/domain";
import {IKafkaHandler} from "../../../../../infra/kafka/src/lib/types";

export type PaymentRequestAvroModel = {
  id: string;
  sagaId: string;
  customerId: string;
  orderId: string;
  price: number;
  createdAt: string;
  paymentOrderStatus: OrderStatus

}
export class PaymentRequestListener implements IKafkaHandler{
  handle(event: PaymentRequestAvroModel): any {
    console.log({event})
  }
}
