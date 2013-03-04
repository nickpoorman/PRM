/*
 * talked.js
 */

var debug = true;
var util = require('util')
var path = require("path");
var express = require("express");

var email = require('./email');
var passport = require('passport');

var check = require('validator').check;
var sanitize = require('validator').sanitize;

var User = require('../models/user');
var Contact = require('../models/contact');
var CustomField = require('../models/custom-field');

var app = module.exports = express();
var viewPath = path.resolve(__dirname, '..', 'views');
app.set("views", viewPath);
app.set('view engine', 'jade');

// need to be able to add 

app.get('/contacts/:contact/talked/new', passport.ensureAuthenticated, getContact, function(req, res) {
  return res.render('contact/talked/new');
});

app.post('/contacts/:contact/talked', passport.ensureAuthenticated);

// app.get('/contacts/:contact/:talked', passport.ensureAuthenticated, getAllContacts, function(req, res, next) {
//   return res.render('contact/index');
// });

// app.get('/contacts/:id', passport.ensureAuthenticated, getContact, function(req, res, next) {
//   return res.render('contact/show');
// });

// app.get('/contacts/:id/edit', passport.ensureAuthenticated, getContact, function(req, res, next) {
//   res.locals.loadedModel = res.locals.contact;
//   return res.render('contact/edit');
// });

// app.put('/contacts/:id', passport.ensureAuthenticated, validateContact, getContact, updateContact);

// app.del('/contacts/:id', passport.ensureAuthenticated, deleteContact);

/* helpers ----------------------------------------------------- */
function getContact(req, res, next) {
  var contacts = req.user.contacts;
  var contact = contacts.id(req.param('contact'));

  // if the contact doesn't exist send them to the index page with an error
  if (!contact) {
    res.locals.contacts = contacts;
    return getAllContacts(req, res, function() {
      return res.render('contact/alert-contact-does-not-exist');
    });
  }

  res.locals.contact = contact;
  next();
}

function getAllContacts(req, res, next) {
  var contacts = req.user.contacts;
  if (!contacts || !contacts.length) {
    //TODO: test this. not sure what it will do if it doesn't find any
    // maybe it's not a big deal? or instead just render a page saying you dont have any. lets add one!
    // send them back to the page with a flash message
    return res.render('contact/contacts-empty');
  }
  res.locals.contacts = contacts;
  return next();
}