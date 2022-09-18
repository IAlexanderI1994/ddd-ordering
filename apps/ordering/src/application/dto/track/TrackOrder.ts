import {IsNotEmpty, IsUUID} from "class-validator";

export class TrackOrderDto {
  @IsUUID()
  @IsNotEmpty()
  private readonly orderTrackingId: string;
}
