/*
 * contact.js
 */

var debug = true;
var path = require("path");
var express = require("express");

var email = require('./email');
var passport = require('passport');

var User = require('../models/user');

var app = module.exports = express();
var viewPath = path.resolve(__dirname, '..', 'views');
app.set("views", viewPath);
app.set('view engine', 'jade');

// passport.ensureAuthenticated, 
app.get('/contact', passport.ensureAuthenticated, function(req, res) {
  return res.render('contact/test');
});