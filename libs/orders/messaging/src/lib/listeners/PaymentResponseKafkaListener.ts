import {OrderStatus} from "@ordering/common/domain";
import {IKafkaHandler} from "../../../../../infra/kafka/src/lib/types";
import {Injectable} from "@nestjs/common";
import {PaymentResponseMessageListener} from "@ordering/orders/application";
import {OrderMessagingDataMapper} from "../mappers/OrderMessagingDataMapper";

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

@Injectable()
export class PaymentResponseKafkaListener implements IKafkaHandler {

  constructor(
    private readonly paymentResponseMessageListener: PaymentResponseMessageListener
  ) {
  }

  handle(data: PaymentResponseAvroModelData): any {
    const paymentResponse = OrderMessagingDataMapper.paymentResponseAvroModelToPaymentResponse(data)
    if (data.paymentOrderStatus === OrderStatus.COMPLETED) {
      this.paymentResponseMessageListener.paymentCompleted(paymentResponse)
    } else {
      this.paymentResponseMessageListener.paymentCancelled(paymentResponse)
    }
  }
}
