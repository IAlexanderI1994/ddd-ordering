START DOCKER: 

docker-compose -f ./infrastructure/docker-compose/common.yml -f ./infrastructure/docker-compose/zookeeper.yml -f ./infrastructure/docker-compose/common.yml -f ./infrastructure/docker-compose/kafka_cluster.yml -f ./infrastructure/docker-compose/init_kafka.yml up 


docker-compose -f ./infrastructure/docker-compose/postgres.yml up 


kafka.order.avro.model.PaymentRequestAvroModel
