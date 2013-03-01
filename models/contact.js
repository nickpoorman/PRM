/**
 * Contact Schema
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schemas
var TalkedSchema = require('./talked').schema;

var ContactSchema = new Schema({
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  },
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

ContactSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if(!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

module.exports = mongoose.model("Contact", ContactSchema);