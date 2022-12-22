import {EventSubscriber, EntitySubscriberInterface, InsertEvent, DataSource, UpdateEvent} from "typeorm";
import {RestaurantEntity} from "../entity/RestaurantEntity";
import {InjectDataSource} from "@nestjs/typeorm";

@EventSubscriber()
export class RestaurantSubscriber implements EntitySubscriberInterface<RestaurantEntity> {

  constructor(@InjectDataSource() private readonly connection: DataSource) {
    connection.subscribers.push(this)
  }

  listenTo() {
    return RestaurantEntity
  }

  private async refreshMaterializedView(event: InsertEvent<RestaurantEntity> | UpdateEvent<RestaurantEntity>)  {
    await event.manager.query('REFRESH MATERIALIZED VIEW order_restaurant_m_view')

  }
  async afterInsert(event: InsertEvent<RestaurantEntity>) {
    await this.refreshMaterializedView(event)
  }

  async afterUpdate(event: UpdateEvent<RestaurantEntity>) {
    await this.refreshMaterializedView(event)
  }

}
