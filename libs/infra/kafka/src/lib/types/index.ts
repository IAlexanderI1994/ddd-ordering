export type KafkaModuleConfig = {
  clientId: string;
  schemaRegistryHost: string;
  brokers: string[];
}


export type KafkaOptions<T extends KafkaProducerConfig | KafkaConsumerConfig> = {
  config: {
    useFactory: (...args) => T;
    inject?: any[]
  }
  schemaPath: string,
}

export type KafkaProducerConfig = {
  topic: string;
}
export type KafkaConsumerConfig = KafkaProducerConfig & {   groupId: string; }

export interface KafkaVisitor {
  visit(...args);
}
