/*
 * contact.js
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

// passport.ensureAuthenticated, 
app.get('/contacts/new', passport.ensureAuthenticated, function(req, res) {
  res.locals.nav = 'Add Friend';
  return res.render('contact/new');
});

app.post('/contacts', passport.ensureAuthenticated, validateContact, validateCustomField, saveContact);

app.get('/contacts', passport.ensureAuthenticated, getAllContacts, function(req, res, next) {
  return res.render('contact/index');
});

app.get('/contacts/:id', passport.ensureAuthenticated, getContact, function(req, res, next) {
  return res.render('contact/show');
});

app.get('/contacts/:id/edit', passport.ensureAuthenticated, getContact, function(req, res, next) {
  res.locals.loadedModel = res.locals.contact;
  return res.render('contact/edit');
});

app.put('/contacts/:id', passport.ensureAuthenticated, validateContact, getContact, updateContact);

app.del('/contacts/:id', passport.ensureAuthenticated, deleteContact);

/* helpers ----------------------------------------------------- */

function validateContact(req, res, next) {
  console.log(util.inspect(req.body));
  // going to do the validations here
  var params = ['firstName', 'lastName', 'company'];

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

  // if there is only a number it will be displayed under a category called # on the page
  next();
}

function validateCustomField(req, res, next) {
  var params = ['phone', 'phoneLabel'];
  // first check if they are an array
  var customPhones = req.body['customPhones'] = req.body['customPhones'] || [];
  var phones = req.body['phone'];
  var phoneLabels = req.body['phoneLabel'];
  if (Array.isArray(phones) && Array.isArray(phoneLabels)) {
    // maybe trim the fields?, make sure the arrays are the same length?
    // for now lets just put it into a nice format that we can save
    // TODO: also create a custom field for any that are created so we can load them later
    for (var i = 0; i < phones.length && i < phoneLabels.length; i++) {
      var label = phoneLabels[i];
      var value = phones[i];
      customPhones.push({
        label: label,
        value: value
      });
    }
  }
  // maybe now trim the fields?
  // TODO: trim the fields
  next();
}

function saveContact(req, res, next) {
  // save the contact now that it has been validated
  var contact = new Contact({
    firstName: req.body['firstName'],
    lastName: req.body['lastName'],
    company: req.body['company'],
    phones: req.body['customPhones'],
  });

  req.user.contacts.push(contact);

  req.user.save(function(err) {
    if (err) {
      return res.render('contact/alert-database-add-contact-error');
    }
    //TODO: change this to contact show
    return res.redirect('/contacts/' + contact.id);
  });
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

function getContact(req, res, next) {
  var contacts = req.user.contacts;
  var contact = contacts.id(req.param('id'));

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

function updateContact(req, res, next) {
  // save the contact now that it has been validated
  var contact = res.locals.contact;
  contact.firstName = req.body['firstName'];
  contact.lastName = req.body['lastName'];
  contact.company = req.body['company'];
  contact.phone = req.body['phone'];

  req.user.save(function(err) {
    if (err) {
      return res.render('contact/alert-database-add-contact-error');
    }
    //TODO: change this to contact show
    return res.redirect('/contacts/' + contact.id);
  });
}

function deleteContact(req, res, next) {
  var contacts = req.user.contacts;
  var contact = contacts.id(req.param('id'));

  contact.remove();
  req.user.save(function(err) {
    if (err) {
      return res.render('contact/alert-database-remove-contact-error');
    }
  });
  return res.redirect('/contacts');
}