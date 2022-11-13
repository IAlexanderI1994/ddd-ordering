import {OrderApprovalStatus} from "@delivery/common/domain";


export type RestaurantApprovalResponseAvroModelData = {
  id: string;
  sagaId: string;
  paymentId: string;
  orderId: string;
  createdAt: string;
  orderApprovalStatus: OrderApprovalStatus;
  failureMessages: string[];

}

export class RestaurantApprovalResponseAvroModel implements RestaurantApprovalResponseAvroModelData {
  constructor(
    data: RestaurantApprovalResponseAvroModelData
  ) {
    Object.assign(this, data)
  }

  id: string;
  sagaId: string;
  paymentId: string;
  orderId: string;
  restaurantId: string;
  createdAt: string;
  orderApprovalStatus: OrderApprovalStatus;
  failureMessages: string[];
}
