/**
 * Module dependencies.
 */

// base dependencies for app ----------------------------------------------------
var express = require("express");
var routes = require("./routes/routes");
var http = require("http");
var path = require("path");

var connect = require('connect');

var passport = require('passport');
var mongoose = require('mongoose');

// node-validator
var expressValidator = require('express-validator');

// app config -------------------------------------------------------------------
var app = module.exports = express();

// Session store | Redis --------------------------------------------------------
var clientOption = {};
/* Only use in production environment */
if('production' == app.get('env')) {
  var redis = require('redis');
  var client = redis.createClient(6379, 'nodejitsudb5457318215.redis.irstack.com');
  clientOption = { client: client };
  client.auth('nodejitsudb5457318215.redis.irstack.com............', function(err) {
    if(err) {
      throw err;
    }
    // You are now connected to your redis.
    console.log("connected to redis");
  });
  app.use(express.errorHandler());
}

var RedisStore = require('connect-redis')(express);
var sessionStore = new RedisStore(clientOption);

// Database | MongoDB -----------------------------------------------------------
var mongoose = require('mongoose');
//var Schema = mongoose.Schema;
var uri = "mongodb://localhost/friendglu"
if('production' == app.get('env')) {
  uri = 'mongodb://nodejitsu_nickpoorman.............';
}
//var conn = mongoose.createConnection(uri, {server:{poolSize:2}}); // this doesn't seem to be working
mongoose.connect(uri);
mongoose.connection.on("open", function() {
  console.log(__filename + ": We have connected to mongodb");
});
mongoose.connection.on('error', function(err) {
    console.error('MongoDB error: %s', err);
});

// Passport | config -----------------------------------------------------------
// dependencies for authentication
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

// Define local strategy for Passport
passport.use(new LocalStrategy({
  usernameField: "email"
}, function(email, password, done) {
  User.authenticate(email, password, function(err, user, info) {
    done(err, user, info);
  });
}));

// serialize user on login
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// deserialize user on logout / session lookup?
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// All | config -----------------------------------------------------------
// config - all environments
app.set('port', process.env.PORT || 80);
app.set("views", __dirname + "/views");
//app.set('view engine', 'hbs');
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/assets/ico/favicon.ico'));
app.use(express.logger('dev'));
// Compress response data with gzip / deflate.
app.use(express.compress());
/*
    http://tjholowaychuk.com/post/18418627138/connect-2-0
    TODO: refactor? for Connect 2.0
    The cookieParser() middleware now supports signed cookies,
    and accepts a secret. This replaces the need to pass
    session({ secret: string }) to the session() middleware.
    Signed cookies are available via req.signedCookies, and
    unsigned as req.cookies.
    */
app.use(express.cookieParser("XXnonceIfIedSecretCookiesXX"));
app.use(express.bodyParser());
app.use(expressValidator);
app.use(express.methodOverride());
app.use(express.session({
  //  secret: "nonceified",
  store: sessionStore
  //  cookie: { secure: true }
}));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions.
app.use(passport.initialize());
app.use(passport.session());
// add the currentUser to locals
app.use(function(req, res, next) {
  res.locals.user = req.user;
  //res.locals.currentUser = req.user;
  res.locals.session = req.session;
  res.locals.title = "FriendGlu &middot; PRM";
  next();
});
app.use(app.router);
app.use(express.static('public'));

// config - development
if('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// routes -----------------------------------------------------------------------
require('./routes/routes')(app);


// The 404 Route (ALWAYS Keep this as the last route)
// app.get "*path", (req, res) ->  
//  if the resource is not found then forward to backbone's router
// app.use(function(req, res) {
//   var newUrl;
//   newUrl = req.protocol + '://' + req.get('Host') + '/#' + req.url;
//   return res.redirect(307, newUrl);
// });
// server -----------------------------------------------------------------------
http.createServer(app).listen(app.get("port"), function() {
  console.log("Express server listening on port " + app.get("port"));
});