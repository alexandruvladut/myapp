var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./queries');

//REDIS
var redis = require('redis');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var clientRedis = redis.createClient();

//SOAP
var soap = require('soap');
var http = require('http');
var fs = require('fs');

var config = require('./config/environment');

//RabbbitMQ
var amqp = require('amqplib/callback_api');

var index = require('./routes/index');
var register = require('./routes/register');
var login = require('./routes/login');
var users = require('./routes/users');
var projects = require('./routes/projects');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'keyboard cat',
    // create new redis store.
    store: new redisStore({
        host: config.connection.redis.host,
        port: config.connection.redis.port,
        client: clientRedis,
        ttl: config.connection.redis.ttl
    }),
    saveUninitialized: false,
    resave: false
}));

app.use('/', index);
app.use('/register', register);
app.use('/login', login);
app.use('/projects', projects);
app.use('/users', users);


/*SOAP Server*/
var service = {
    ProjectService: {
        ProjectServiceSOAP: {
            PutProject: function (args, callback) {
                var id = args.id;
                var name = args.name;
                var description = args.description;
                var status = args.status;

                var project = {
                    id: id,
                    name: name,
                    description: description,
                    status: status
                };


                db.modifyProject(project, function (data) {
                    return callback(data);
                });

            }
        }
    }
}
var xml = fs.readFileSync('myapp.wsdl', 'utf8');
var server = http.createServer(function (request, response) {
    response.end("404: Not Found: " + request.url)
});

server.listen(8000);
soap.listen(server, '/wsdl', service, xml);


//rabbitMQ publisher
amqp.connect('amqp://localhost', function (err, conn) {
    conn.createChannel(function (err, ch) {
        var q = 'projects';

        ch.assertQueue(q, {durable: false});
        // Note: on Node 6 Buffer.from(msg) should be used

        db.getAllProjects(function (data) {
            data.forEach(function (d) {
                ch.sendToQueue(q, new Buffer(JSON.stringify(d)));
                console.log(" [x] Sent '" + JSON.stringify(d) + "'");
            })
        })
    });
});

//rabbitMQ consumer
setTimeout(function () {
    amqp.connect('amqp://localhost', function (err, conn) {
        conn.createChannel(function (err, ch) {
            var q = 'projects';

            ch.assertQueue(q, {durable: false});

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
            ch.consume(q, function (msg) {
                console.log(" [x] Received %s", msg.content.toString());
            }, {noAck: true});

        });
    });
}, 3 * 1000);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
