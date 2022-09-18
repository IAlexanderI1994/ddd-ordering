import { IsNotEmpty, IsNumber, IsUUID, Min} from "class-validator";

export class OrderItemDto {

  @IsUUID()
  @IsNotEmpty()
  private readonly productId: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  private readonly quantity: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  private readonly price: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  private readonly subtotal: number;



}
