export class PaymentRequest {

  constructor(
    private readonly id: string,
    private readonly sagaId: string
    ) {
  }
}
