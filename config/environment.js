/**
 * Created by alexvladut on 15/02/2017.
 */
var config = {};

config.wsdl = {};
config.wsdl.url = 'http://localhost:8000/wsdl?wsdl';

config.connection = {};

config.connection.redis = {
    host: 'localhost',
    port: 6379,
    ttl: 5 * 60
};

config.connection.postgres = {
    host: "localhost",
    port: 5432,
    database: "myapp",
    user: "postgres",
    password: "Egu35ilde"
};

module.exports = config;