/*
 * Email module
 */

var path = require('path');
var templatesDir = path.resolve(__dirname, '..', 'email_templates');
var emailTemplates = require('email-templates');
var nodemailer = require('nodemailer');


// create reusable transport method (opens pool of SMTP connections)
var transport = nodemailer.createTransport("SMTP", {
  service: "Gmail",
  auth: {
    user: "officialfriendglu@gmail.com",
    pass: "Welove2glue"
  },
  maxConnections: 5
});


module.exports = {
  // this should be an async call
  sendVerificationEmail: function(user) {
    process.nextTick(function() {
      emailTemplates(templatesDir, function(err, template) {
        if(err) {
          console.log(err);
        } else {

          // An example users object with formatted email function
          var locals = {
            user: user,
            logoUrl: "http://friendglu.com/images/logo-sm.png",
            registerConfirmUrl: "http://friendglu.com/verify-account/",
            supportUrl: "http://support.friendglu.com/"
          };

          // Send a single email
          //template('verify', user, function(err, html, text) {
          template('verify', locals, function(err, html, text) {
            if(err) {
              console.log(err);
            } else {
              // send mail with defined transport object
              transport.sendMail({
                from: "friendglu.com <no-reply@friendglu.com>",
                // sender address
                to: user.email,
                // list of receivers
                //replyTo: "" // replyTo address - don't really need it
                subject: "Please confirm your email address",
                // Subject line
                //text: text,
                // plaintext body
                html: html // html body
              }, function(error, response) {
                if(error) {
                  console.log(error);
                } else {
                  console.log("Message sent: " + response.message);
                }
                // if you don't want to use this transport object anymore, uncomment following line
                //smtpTransport.close(); // shut down the connection pool, no more messages
              });
            }
          });
        }
      });
    });
  },

  sendForgotPasswordEmail: function(user) {
    process.nextTick(function() {
      emailTemplates(templatesDir, function(err, template) {
        if(err) {
          console.log(err);
        } else {

          // An example users object with formatted email function
          var locals = {
            user: user,
            logoUrl: "http://friendglu.com/images/logo-sm.png",
            resetPasswordUrl: "http://friendglu.com/reset-password",
            supportUrl: "http://support.friendglu.com/"
          };

          // Send a single email
          //template('verify', user, function(err, html, text) {
          template('reset_password', locals, function(err, html, text) {
            if(err) {
              console.log(err);
            } else {
              // send mail with defined transport object
              transport.sendMail({
                from: "friendglu.com <no-reply@friendglu.com>",
                // sender address
                to: user.email,
                // list of receivers
                //replyTo: "" // replyTo address - don't really need it
                subject: "FriendGlu password reset confirmation",
                // Subject line
                //text: text,
                // plaintext body
                html: html // html body
              }, function(error, response) {
                if(error) {
                  console.log(error);
                } else {
                  console.log("Message sent: " + response.message);
                }
                // if you don't want to use this transport object anymore, uncomment following line
                //smtpTransport.close(); // shut down the connection pool, no more messages
              });
            }
          });
        }
      });
    });
  }
}