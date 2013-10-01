
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var util = require('util');
var querystring = require('querystring');
var mongodb = require ('mongodb');  
var app = express();


var Db = mongodb.Db;
var Connection = mongodb.Connection; 
var Server = mongodb.Server;
var host = '127.0.0.1';
var port = 27017;
var db=new Db ('users_db', new Server(host,port, {}));

db.open(function(e, c) {
// console.log (util.inspect(db));
// creates server
var server = http.createServer(function(req, res) {
    //sets the right header and status code
    res.writeHead(200, {
      'Content-Type': 'text/plain'
});
    //outputs string with line end symbol
    res.end(db._state);
  });
  //sets port and IP address of the server
server.listen(port, function() { console.log(
      'Server is running at %s:%s ',
    server.address().address,
    server.address().port);
});
  db.close();
});


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
