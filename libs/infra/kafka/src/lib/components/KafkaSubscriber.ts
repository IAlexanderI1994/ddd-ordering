import {IEvent, IMessageSource} from '@nestjs/cqrs';
import {Subject} from 'rxjs';
import {Consumer, Kafka} from 'kafkajs';
import {Inject, Injectable, Optional} from '@nestjs/common';
import {SchemaRegistry} from "@kafkajs/confluent-schema-registry";
import {CLIENT_ID, KAFKA_BROKERS, KAFKA_CONFIG, KAFKA_EVENT_VISITOR, KAFKA_SCHEMA} from "../tokens";
import {KafkaConsumerConfig, KafkaVisitor} from "../types";
import {EVENTS} from "../events";
import {classToClassFromExist, plainToClass, plainToInstance} from "class-transformer";

@Injectable()
export class KafkaSubscriber implements IMessageSource {

  private readonly kafkaConsumer: Consumer
  private bridge: Subject<any>
  private readonly registry: SchemaRegistry;
  private readonly registryId: number;

  constructor(
    @Inject(KAFKA_BROKERS) brokers: string[],
    @Inject(KAFKA_CONFIG) private readonly config: KafkaConsumerConfig,
    @Inject(CLIENT_ID) clientId: string,
    @Inject(KAFKA_SCHEMA) schema: { registry: SchemaRegistry, registryId: number },
    @Optional()@Inject(KAFKA_EVENT_VISITOR) private readonly kafkaEventVisitor: KafkaVisitor
  ) {

    const kafka = new Kafka({
      brokers,
      clientId,
    })
    const { groupId } = config

    this.kafkaConsumer = kafka.consumer({groupId});
    this.registry = schema.registry;
    this.registryId = schema.registryId

    this.eachMessage = this.eachMessage.bind(this)
  }

  async eachMessage({topic, message}) {

    if (this.bridge) {
      if ( topic === this.config.topic) {
        const avroModel = await this.registry.decode(message.value)
        this.kafkaEventVisitor?.visit(avroModel)
        const Event = EVENTS[avroModel.constructor.name]
        if ( !Event) return;
        const eventInstance = plainToInstance(Event, {...avroModel})
        this.bridge.next(eventInstance)
      }
    }

  }

  async connect(): Promise<void> {
    await this.kafkaConsumer.connect();
    await this.kafkaConsumer.subscribe({topic: this.config.topic, fromBeginning: false})
    await this.kafkaConsumer.run({
        eachMessage: this.eachMessage
      }
    )
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any {
    this.bridge = subject
  }

}

export default KafkaSubscriber;
