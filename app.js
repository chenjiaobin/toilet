var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dataRouter = require('./routes/data');

var session = require('express-session')
// session持久化中间件，即在设定的实效内session都有效
var NedbStore = require('nedb-session-store')( session );
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// session持久化中间件配置
const sessionMiddleware = session({
    secret: "fas fas",// 加密key，可以随意填写
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000   // 一天
    },
    store: new NedbStore({
      filename: 'path_to_nedb_persistence_file.db'
    })
  })
  app.use(sessionMiddleware); // 加入配置好的中间件
// session证书
// app.use(session({
//   secret: '#sddjswjdhww22ygfw2233@@@%#$!@%Q!%*12',
//   resave: false,
//   saveUninitialized: true
// }))
app.use(function(req, res, next){ 
  res.locals.session = req.session;
  next();
  });
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/data', dataRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
