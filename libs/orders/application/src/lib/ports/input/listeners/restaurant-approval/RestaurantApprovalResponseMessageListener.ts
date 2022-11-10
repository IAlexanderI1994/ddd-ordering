import {IRestaurantApprovalResponseMessageListener} from "./interfaces/IRestaurantApprovalResponseMessageListener";
import {RestaurantApprovalResponseDto} from "../../../../dto/message/RestaurantApprovalResponse";
import {Injectable} from "@nestjs/common";

@Injectable()
export class RestaurantApprovalResponseMessageListener implements IRestaurantApprovalResponseMessageListener {
  orderApproved(restaurantApprovalResponse: RestaurantApprovalResponseDto): void {
    return;
  }

  orderRejected(restaurantApprovalResponse: RestaurantApprovalResponseDto): void {
    return;
  }



}
