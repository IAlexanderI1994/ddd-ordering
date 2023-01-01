import { IsNotEmpty, IsNumber, IsUUID, Min} from "class-validator";
export class OrderItemDto {

  @IsUUID()
  @IsNotEmpty()
  readonly productId: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  readonly quantity: number;


}
export class ExtendedOrderItemDto extends OrderItemDto{

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  readonly price: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  readonly subtotal: number;

}



