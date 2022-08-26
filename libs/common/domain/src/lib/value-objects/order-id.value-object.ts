import {BaseId} from "./base-id.value-object";

export class OrderId extends BaseId<string> {

  constructor(value) {
    super(value);
  }

}
