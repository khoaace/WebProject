var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exphbs=require('express-handlebars');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var infoProduct = require('./routes/product');
var addProduct = require('./routes/addProduct');
var add = require('./routes/add');
var mongodb = require('mongoose');
var app = express();

// view engine setup
app.engine('hbs',exphbs({extname:'hbs',defaultLayout:'layout', layoutsDir:__dirname + '/views/layouts'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product',infoProduct);
app.use('/addProduct',addProduct);
app.use('/add',add);


//connect to database
mongodb.connect('mongodb://localhost:27017/eshopping');


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
// Print notify in console
console.log('Ket noi database thanh cong');
module.exports = app;
