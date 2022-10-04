import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {OrderEntity} from "../entity/OrderEntity";
import {InjectRepository as TypeORMRepository} from "@nestjs/typeorm";
import {IOrderRepository} from "./interfaces/IOrderRepository";
import {Optional} from "@ordering/common/types";
import {Order} from "@ordering/orders/domain";
import {OrderDataAccessMapper} from "../mappers/OrderDataAccessMapper";

@Injectable()
export class OrderRepositoryImpl implements IOrderRepository {
  constructor(
    @TypeORMRepository(OrderEntity)
    private orderEntityRepository: Repository<OrderEntity>
  ) {
  }


  async findByTrackingId(trackingId: string): Promise<Optional<Order>> {

    const orderEntity: Optional<OrderEntity> = await this.orderEntityRepository.findOneBy({
      trackingId
    })
    return orderEntity ? OrderDataAccessMapper.orderEntityToOrder(orderEntity) : null;
  }

  async save(order: Order): Promise<Order> {

    const orderEntity: OrderEntity = await this.orderEntityRepository.save(
      OrderDataAccessMapper.orderToOrderEntity(order)
    )

    return OrderDataAccessMapper.orderEntityToOrder(orderEntity)

  }


}
