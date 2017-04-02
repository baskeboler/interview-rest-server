

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/user');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var AuthController = require('./controllers/auth.controller');

var authCtrl = new AuthController();

passport.use(new BearerStrategy(
  function(token, done) {
    authCtrl.isValidSessionId({sessionId: token})
      .then(res => done(null, res))
      .catch(err => done(err));
  }
));

var app = express();

//CORS middleware
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(allowCrossDomain);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules', 'normalize.css')));

app.use('/', routes);
app.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  console.log(`${username} :: ${password}`);
  authCtrl.login({username: username, password: password}).then(cred => {
    res.status(200).send({token: cred});
  }).catch(err => res.status(401).send({message: err}));
});

app.post('/create-user', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  console.log(`${username} :: ${password}`);
  authCtrl.createUser({username: username, password: password})
  res.sendStatus(201);
});

app.use('/users', passport.authenticate('bearer', {session: false}), users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
