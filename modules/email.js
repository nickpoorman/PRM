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
    user: "example@gmail.com",
    pass: "pass"
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
            logoUrl: "http://zapwire.me/images/logo-sm.png",
            registerConfirmUrl: "http://zapwire.me/verify-account/",
            supportUrl: "http://support.zapwire.me/"
          };

          // Send a single email
          //template('verify', user, function(err, html, text) {
          template('verify', locals, function(err, html, text) {
            if(err) {
              console.log(err);
            } else {
              // send mail with defined transport object
              transport.sendMail({
                from: "Zapwire.me <no-reply@zapwire.me>",
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
            logoUrl: "http://zapwire.me/images/logo-sm.png",
            resetPasswordUrl: "http://zapwire.me/reset-password",
            supportUrl: "http://support.zapwire.me/"
          };

          // Send a single email
          //template('verify', user, function(err, html, text) {
          template('reset_password', locals, function(err, html, text) {
            if(err) {
              console.log(err);
            } else {
              // send mail with defined transport object
              transport.sendMail({
                from: "Zapwire.me <no-reply@zapwire.me>",
                // sender address
                to: user.email,
                // list of receivers
                //replyTo: "" // replyTo address - don't really need it
                subject: "Regattable password reset confirmation",
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