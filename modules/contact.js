/*
 * contact.js
 */

var debug = true;
var path = require("path");
var express = require("express");

var email = require('./email');
var passport = require('passport');

var check = require('validator').check;
var sanitize = require('validator').sanitize;

var User = require('../models/user');
var Contact = require('../models/contact');

var app = module.exports = express();
var viewPath = path.resolve(__dirname, '..', 'views');
app.set("views", viewPath);
app.set('view engine', 'jade');

// passport.ensureAuthenticated, 
app.get('/contacts/new', passport.ensureAuthenticated, function(req, res) {
  return res.render('contact/new');
});

app.post('/contacts', passport.ensureAuthenticated, validateContact, saveContact);

app.get('/contacts', passport.ensureAuthenticated, getAllContacts, function(req, res, next){
  return res.render('contact/index');
});

/* helpers ----------------------------------------------------- */

function validateContact(req, res, next) {
  // going to do the validations here
  var params = ['firstName', 'lastName', 'company', 'phone'];

  // at least one field must be filled in
  var empty = 0;
  for (var i = 0; i < params.length; i++) {
    try {
      check(req.body[params[i]]).notEmpty();
    } catch (err) {
      empty++;
    }
  }
  if (empty >= params.length) {
    // at least one field must have a value
    return res.render('alert-no-data');
  }

  // now add all the fields to the views locals
  res.locals.params = {};
  for (var i = 0; i < params.length; i++) {
    res.locals.params[params[i]] = req.body[params[i]];
  }

  // validate any fields that are filled in
  // only one needed is the phone number
  // validate the number, strip out all characters except allowed
  // TODO: do some sort of regex validator here
  //req.assert('phone', 'Phone number is too short.').notEmpty();
  var mappedErrors = req.validationErrors();
  if (mappedErrors) {
    // don't attempt to save, return the errors
    return res.render('contact/new', {
      errors: mappedErrors
    });
  }

  req.sanitize('firstName').trim();
  req.sanitize('lastName').trim();
  req.sanitize('company').trim();
  req.sanitize('phone').trim();

  // if there is only a number it will be displayed under a category called # on the page
  next();
}

function saveContact(req, res, next) {
  // save the contact now that it has been validated
  var contact = new Contact({
    firstName: req.body['firstName'],
    lastName: req.body['lastName'],
    company: req.body['company'],
    phone: req.body['phone'],
  });

  req.user.contacts.push(contact);

  req.user.save(function(err) {
    if (err) {
      return res.render('contact/alert-database-add-contact-error');
    }
    //TODO: change this to contact show
    return res.render('contact/test');
  });
}

function getAllContacts(req, res, next){
  var contacts = req.user.contacts;
  if(!contacts || !contacts.length) {
    //TODO: test this. not sure what it will do if it doesn't find any
    // maybe it's not a big deal? or instead just render a page saying you dont have any. lets add one!
    // send them back to the page with a flash message
    return res.render('contact/contacts-empty');
  }
  res.locals.contacts = contacts;
  return next();
}