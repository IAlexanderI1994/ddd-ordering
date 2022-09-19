import {IDomainEventPublisher} from "@ordering/common/domain";
import {OrderPaidEvent} from "@ordering/orders/domain";

export  interface OrderPaidRestaurantRequestMessagePublisher extends IDomainEventPublisher<OrderPaidEvent>{

}
