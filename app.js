//----------- express default packages
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

//Handle file upload
var multer = require('multer');
var storage = multer.memoryStorage();

var indexRouter = require('./routes/index');
var ballotRouter = require('./routes/ballot');
var usersRouter = require('./routes/users');
// kien add packages


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Handle files upload
app.use(multer({storage: storage}).single('avatar'));
//app.locals.upload = multer({ dest: './public/images/uploads' });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Global vars
//app.use(function(req, res, next){
  //res.locals.candidates = [];
 // next();
//});

app.use('/', indexRouter);
app.use('/ballot', ballotRouter);
app.use('/users', usersRouter);

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
