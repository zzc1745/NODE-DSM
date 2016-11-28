var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var hbs = exphbs.create({
  partialsDir: 'views/partial/',
  layoutsDir: "views/layout/",
  defaultLayout: 'main',
  extname: '.hbs'
})
app.engine('hbs', hbs.engine);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));   //将静态文件目录设置为项目根目录+/public
app.use(express.static(path.join(__dirname, '/')));        //如果在public里面找不到,就去根目录下找

app.use(session({
  name: 'pokerOwner',   //name指的是cookie的name，默认cookie的name是：connect.sid
  maxAge: 30*1000,
  secret:'simple-poker-secret-key',
  resave:false,
  saveUninitialized:false
}))

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
