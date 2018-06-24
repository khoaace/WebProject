var createError = require('http-errors');
var express = require('express');
var path = require('path');
var exphbs=require('express-handlebars');
var Handlebars     = require('handlebars');
var HandlebarsIntl = require('handlebars-intl');
var mongodb = require('mongoose');
var back = require('express-back');
var passport = require('passport');


var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

var configDB = require('./config/database');


var app = express();

// view engine setup
app.engine('hbs',exphbs({extname:'hbs',defaultLayout:'layout', layoutsDir:__dirname + '/views/layouts'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('superSecret', 'verysecret');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash({ unsafe: true }));
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 900000 }}));
// Login
app.use(back());
app.use(passport.initialize());
app.use(passport.session());

require('./routes/users')(app, passport);
require('./config/passport')(passport);


//Khai báo route
var indexRouter = require('./routes/index');
var infoProduct = require('./routes/product');
var dashBoard = require('./routes/dashboard');

app.use('/', indexRouter);
app.use('/product',infoProduct);
app.use('/dashboard',dashBoard);

HandlebarsIntl.registerWith(Handlebars);

//connect to database
mongodb.connect(configDB.database_local, function(err){
    if (err)
    {
        console.log('[!] - Khong the ket noi toi DATABASE');
    }
    else{
        console.log('[i] - Ket noi database thanh cong');
    }
});

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

module.exports = app;