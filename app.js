var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const url = require('url');

var appRoutes = require('./app_server/routes/index');
var apiRoutes = require('./app_api/routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/app_server/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/ipfs', function(req, res, next) {
    if (req.method !== "GET") {
        next();
        return;
    }

    // doctor path
    const requestedUrl = url.parse(req.url);
    const pathComponents = requestedUrl.pathname.split('/');
    const hash = pathComponents[1];
    const hashComponents = [hash.slice(0, 2), hash.slice(2, 4), hash.slice(4, 6), hash.slice(6)];
    req.url = [].concat.apply([], ['', 'ipfs', hashComponents, pathComponents.slice(2)]).join('/');

    next();
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/ipfs', express.static('/tmp/ipfs-cache', { fallthrough: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', appRoutes);
app.use('/api', apiRoutes);

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
