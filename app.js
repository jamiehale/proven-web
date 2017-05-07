const fs = require('fs');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const url = require('url');

const configuration = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config/config.json')))[process.env.NODE_ENV];
const port = configuration.port || 3000;

const mongoose = require('mongoose');
require('proven-models');

const appRoutes = require('./app_server/routes/index');
const apiRoutes = require('./app_api/routes/index');
const provenRoutes = require('./app_proven/routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '/app_server/views'));
app.set('view engine', 'jade');

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
app.use('/proven', provenRoutes);

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

connect()
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);

function listen() {
    if (app.get('env') == 'test') {
        return;
    }
    app.listen(port);
    console.log('Express app started on port ' + port);
}

function connect() {
    let options = { server: { socketOptions: { keepAlive: 1 } } };
    return mongoose.connect(configuration.db.endpoint, options).connection;
}
