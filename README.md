#App environment:
./config/environment.js

#Database script:
myapp.sql

#Start app:
DEBUG=myapp:* npm start

#Redis server:
#start:
redis-server /usr/local/etc/redis.conf
#stop:
redis-cli shutdown
#monitor
redis-cli monitor

#RabbitMQ
#start:
rabbitmq-server
#get queues
rabbitmqctl list_queues

rabbitmqadmin list queues
rabbitmqadmin get queue=projects
rabbitmqadmin -V projects list exchanges