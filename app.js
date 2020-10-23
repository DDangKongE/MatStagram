var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
const passportConfig = require('./config/passport');
var session = require('express-session');
var fileupload = require('express-fileupload');
var methodOverride = require('method-override');
var cookieSession = require('cookie-session');
require('dotenv').config();

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');

var app = express();

// DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_DB_MG);
var db = mongoose.connection;
db.once('open', function(){
  console.log('DB Connected');
});
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieSession({
  keys: ['node_han'],
  maxAge: 1000 * 60 * 120
}))

// Middleware setup
app.use(logger(':method :url :status :res[content-length] - :response-time ms // :date[iso]'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'secretcode', resave: true, saveUninitialized: false })); // 세션 활성화
app.use(passport.initialize());
app.use(passport.session());
passportConfig();
app.use(fileupload());
app.use(methodOverride('_method'))

// Route Setup
app.use('/matstagram', indexRouter);
app.use('/matstagram/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('문제가 발생하였습니다. 뒤로 돌아가주세요.');
});

module.exports = app;
