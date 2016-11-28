var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
// var server = require('http').createServer(app);
// var io = require('socket.io').listen(server);
// var users = {};  //创建用户对象   用来存放用户索引值:socket 键值对
var mongoose =  require('mongoose');
var session = require('express-session');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


//配置hbs基础模板和分块模板
var hbs = exphbs.create({
  partialsDir: 'views/partial/',
  layoutsDir: "views/layout/",
  defaultLayout: 'main',
  extname: '.hbs'
  // helpers: hbsHelper
});
app.engine('hbs', hbs.engine);



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/')));    //这一行的缺失,导致了我layout层获取不到的错误
//添加session支持
app.use(session({
  name: 'chatClient',   //name指的是cookie的name，默认cookie的name是：connect.sid
  maxAge:30*1000,
  secret:'simple-blog-secret-key',
  resave:false,
  saveUninitialized:false
}))



app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

