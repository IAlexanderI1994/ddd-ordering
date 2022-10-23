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
export class PaymentRequestAvroModel {
  constructor(
    private readonly data: PaymentRequestAvroModelData
  ) {
  }
}
