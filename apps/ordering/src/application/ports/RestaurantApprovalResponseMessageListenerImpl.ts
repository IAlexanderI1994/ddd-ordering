import {
  IRestaurantApprovalResponseMessageListener
} from "./input/listeners/restaurant-approval/IRestaurantApprovalResponseMessageListener";
import {RestaurantApprovalResponseDto} from "../dto/message/RestaurantApprovalResponse";

export class RestaurantApprovalResponseMessageListenerImpl implements IRestaurantApprovalResponseMessageListener{

  orderApproved(restaurantApprovalResponse: RestaurantApprovalResponseDto): void {
  }

  orderRejected(restaurantApprovalResponse: RestaurantApprovalResponseDto): void {
  }


}
