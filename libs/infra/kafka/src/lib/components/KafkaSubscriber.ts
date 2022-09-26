import {IEvent, IMessageSource} from '@nestjs/cqrs';
import {Subject} from 'rxjs';
import {Consumer, Kafka} from 'kafkajs';
import {Inject} from '@nestjs/common';
import {SchemaRegistry} from "@kafkajs/confluent-schema-registry";

class KafkaSubscriber implements IMessageSource {

  private readonly kafkaConsumer: Consumer
  private bridge: Subject<any>
  private readonly events: Array<any>;
  private readonly registry: SchemaRegistry;
  private readonly registryId: number;

  constructor(
    @Inject('KAFKA_BROKERS') brokers: string[],
    @Inject('EVENTS') events: Array<any>,
    @Inject('CLIENT_ID') clientId: string,
    @Inject('GROUP_ID') groupId: string,
    @Inject('KAFKA_REGISTRY') schemaRegistry: { registry: SchemaRegistry, registryId: number }
  ) {
    const kafka = new Kafka({
      brokers,
      clientId,
    })

    this.events = events;
    this.kafkaConsumer = kafka.consumer({groupId});
    this.registry = schemaRegistry.registry;
    this.registryId = schemaRegistry.registryId
  }

  async connect(): Promise<void> {


    await this.kafkaConsumer.connect();
    // for (const event of this.events) {
    //todo: refactor topic
    await this.kafkaConsumer.subscribe({topic: 'payment_request', fromBeginning: false})
    // }


    await this.kafkaConsumer.run({
      eachMessage: async ({topic, partition, message}) => {
        if (this.bridge) {
          // for (const event of this.events) {
          //   if (event.name === topic) {
          console.log(message)
          console.log(message.value.toString())
          const parsedJson = await this.registry.decode(message.value)
          console.log(parsedJson)
          // const receivedEvent = new event(parsedJson)
          // this.bridge.next(receivedEvent)
          //   }
          // }
        }
      }
    })
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any {
    this.bridge = subject
  }

}

export default KafkaSubscriber;
