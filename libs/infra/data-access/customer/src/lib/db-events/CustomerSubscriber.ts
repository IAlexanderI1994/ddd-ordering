import {EventSubscriber, EntitySubscriberInterface, InsertEvent, DataSource, UpdateEvent} from "typeorm";
import {CustomerEntity} from "../entity/CustomerEntity";
import {InjectDataSource} from "@nestjs/typeorm";

@EventSubscriber()
export class CustomerSubscriber implements EntitySubscriberInterface<CustomerEntity> {

  constructor(@InjectDataSource() private readonly connection: DataSource) {
    connection.subscribers.push(this)
  }

  listenTo() {
    return CustomerEntity
  }

  private async refreshMaterializedView(event: InsertEvent<CustomerEntity> | UpdateEvent<CustomerEntity>)  {
    await event.manager.query('REFRESH MATERIALIZED VIEW order_customer_m_view')

  }
  async afterInsert(event: InsertEvent<CustomerEntity>) {
    await this.refreshMaterializedView(event)
  }

  async afterUpdate(event: UpdateEvent<CustomerEntity>) {
    await this.refreshMaterializedView(event)
  }

}
