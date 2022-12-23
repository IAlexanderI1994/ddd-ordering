import {EventSubscriber, EntitySubscriberInterface, InsertEvent, DataSource, UpdateEvent} from "typeorm";
import {RestaurantProductsEntity} from "../entity/RestaurantProductsEntity";
import {InjectDataSource} from "@nestjs/typeorm";

@EventSubscriber()
export class RestaurantProductSubscriber implements EntitySubscriberInterface<RestaurantProductsEntity> {

  constructor(@InjectDataSource() private readonly connection: DataSource) {
    connection.subscribers.push(this)
  }

  listenTo() {
    return RestaurantProductsEntity
  }

  private async refreshMaterializedView(event: InsertEvent<RestaurantProductsEntity> | UpdateEvent<RestaurantProductsEntity>)  {
    await event.manager.query('REFRESH MATERIALIZED VIEW order_restaurant_m_view')

  }
  async afterInsert(event: InsertEvent<RestaurantProductsEntity>) {
    await this.refreshMaterializedView(event)
  }

  async afterUpdate(event: UpdateEvent<RestaurantProductsEntity>) {
    await this.refreshMaterializedView(event)
  }

}
