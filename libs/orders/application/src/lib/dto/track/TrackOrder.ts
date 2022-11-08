import {IsNotEmpty, IsUUID} from "class-validator";

export class TrackOrderQuery {
  @IsUUID()
  @IsNotEmpty()
  readonly orderTrackingId: string;
}
