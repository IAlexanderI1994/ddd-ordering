import {OrderStatus} from "@delivery/common/domain";

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
export class PaymentResponseAvroModel implements PaymentResponseAvroModelData{
  constructor(
    data: PaymentResponseAvroModelData
  ) {
    Object.assign(this, data)
  }
  id: string;
  sagaId: string;
  paymentId: string;
  customerId: string;
  orderId: string;
  price: number;
  createdAt: string;
  paymentOrderStatus: OrderStatus;
  failureMessages: string[];
}
