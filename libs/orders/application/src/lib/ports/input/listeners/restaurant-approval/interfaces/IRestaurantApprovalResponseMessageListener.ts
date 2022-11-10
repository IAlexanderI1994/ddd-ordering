import {RestaurantApprovalResponseDto} from "../../../../../dto/message/RestaurantApprovalResponse";

export interface IRestaurantApprovalResponseMessageListener {

  orderApproved(restaurantApprovalResponse: RestaurantApprovalResponseDto): void
  orderRejected(restaurantApprovalResponse: RestaurantApprovalResponseDto): void

}
