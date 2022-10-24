import {OrderStatus} from "@ordering/common/domain";

export type PaymentRequestAvroModelData = {
  id: string;
  sagaId: string;
  customerId: string;
  orderId: string;
  price: number;
  createdAt: string;
  paymentOrderStatus: OrderStatus

}
export class PaymentRequestAvroModel implements PaymentRequestAvroModelData{
  constructor(
    data: PaymentRequestAvroModelData
  ) {
    Object.assign(this, data)
  }

  id: string;
  sagaId: string;
  createdAt: string;
  customerId: string;
  orderId: string;
  paymentOrderStatus: OrderStatus;
  price: number;
}
