import {IPaymentResponseMessageListener} from "./input/listeners/payments/IPaymentResponseMessageListener";
import {PaymentResponseDto} from "../dto/message/PaymentResponse";

export class PaymentResponseMessageListenerImpl implements IPaymentResponseMessageListener{
  paymentCancelled(paymentResponse: PaymentResponseDto): void {
  }

  paymentCompleted(paymentResponse: PaymentResponseDto): void {
  }



}
