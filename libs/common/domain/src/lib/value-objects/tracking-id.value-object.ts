import {BaseId} from "./base-id.value-object";

export class TrackingId extends BaseId<string> {

  constructor(value) {
    super(value);
  }

}
