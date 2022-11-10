import {Injectable} from "@nestjs/common";
import {IPaymentResponseMessageListener} from "./interfaces/IPaymentResponseMessageListener";
import {PaymentResponseDto} from "../../../../dto/message/PaymentResponse";

@Injectable()
export class PaymentResponseMessageListener  implements IPaymentResponseMessageListener {
  paymentCancelled(paymentResponse: PaymentResponseDto): void {
    return;
  }

  paymentCompleted(paymentResponse: PaymentResponseDto): void {

    return;
  }


}
