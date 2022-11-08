import {OrderStatus, PaymentStatus} from "@ordering/common/domain";
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
export class PaymentResponseListener implements IKafkaHandler{
  handle(data: PaymentResponseAvroModelData): any {

    if ( data.paymentOrderStatus === OrderStatus.COMPLETED) {


    }

  }
}
