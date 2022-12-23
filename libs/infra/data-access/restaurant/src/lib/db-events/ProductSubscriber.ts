import {EventSubscriber, EntitySubscriberInterface, InsertEvent, DataSource, UpdateEvent} from "typeorm";
import {ProductEntity} from "../entity/ProductEntity";
import {InjectDataSource} from "@nestjs/typeorm";

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<ProductEntity> {

  constructor(@InjectDataSource() private readonly connection: DataSource) {
    connection.subscribers.push(this)
  }

  listenTo() {
    return ProductEntity
  }

  private async refreshMaterializedView(event: InsertEvent<ProductEntity> | UpdateEvent<ProductEntity>)  {
    await event.manager.query('REFRESH MATERIALIZED VIEW order_restaurant_m_view')

  }
  async afterInsert(event: InsertEvent<ProductEntity>) {
    await this.refreshMaterializedView(event)
  }

  async afterUpdate(event: UpdateEvent<ProductEntity>) {
    await this.refreshMaterializedView(event)
  }

}
