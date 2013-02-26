/**
 * Contact Schema
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schemas
var TalkedSchema = require('./talked').schema;

var ContactSchema = new Schema({
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  phone: [{
    type: String,
    trim: true
  }],
  talked: {
    type: [TalkedSchema]
  }
});

module.exports = mongoose.model("Contact", ContactSchema);