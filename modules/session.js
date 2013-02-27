// Session
//+ GET     /session           ->  index (/session)
//- GET     /session/new       ->  new
//+ POST    /session           ->  create (/login)
//- GET     /session/:id       ->  show
//- GET     /session/:id/edit  ->  edit
//- PUT     /session/:id       ->  update
//+ DELETE  /session/:id       ->  destroy (/logout)
var express = require("express");
var Util = require("util");
var passport = require("passport");
var app = module.exports = express();

var authenticate = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if(err) {
        return next(err);
      }
      if(!user) {
        // the user wasn't found so send back a message template based on the error
        // do a switch here on the error codes...
        switch(info.errorCode) {
        case 1:
          // email / username invalid
          return res.render('auth/login/alert-invalid-email');
        case 2:
          // password invalid
          return res.render('auth/login/alert-invalid-password');
        case 3:
          // account not activated
          return res.render('auth/login/alert-not-activated');
        }
      }
      req.logIn(user, function(err) {
        if(err) {
          return next(err);
        }
        next();
      });
    })(req, res, next);
  };

// ROUTES -----------------------------------------------------------
app.get('/login', function(req, res) {
  return res.render('auth/login/login');
});

//+ POST    /sessions           ->  create (/login)
//TODO: use a custom middleware here instead of passport.authenticate (this way we can return our own message --and not in the flash)
//http://passportjs.org/guide/authenticate.html
app.post('/login', authenticate, function(req, res) {
  // TODO: this should check the request url, if it isn't /login then it should redirect to that page
  //res.redirect('back');
  return res.redirect('/');
});
//+ DELETE  /sessions/:id       ->  destroy (/logout)
// app.get("/logout", function(req, res){
//   req.logout();
//   return res.send(200);
// });