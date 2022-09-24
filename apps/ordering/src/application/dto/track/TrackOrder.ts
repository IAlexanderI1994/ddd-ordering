import {IsNotEmpty, IsUUID} from "class-validator";

export class TrackOrderDto {
  @IsUUID()
  @IsNotEmpty()
  readonly orderTrackingId: string;
}
