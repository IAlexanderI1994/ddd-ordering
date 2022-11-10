import {PaymentResponseDto} from "../../../../../dto/message/PaymentResponse";

export interface IPaymentResponseMessageListener {

  paymentCompleted(paymentResponse: PaymentResponseDto): void;

  paymentCancelled(paymentResponse: PaymentResponseDto): void;

}
