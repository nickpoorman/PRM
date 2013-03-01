/**
 * Contact Schema
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schemas

var CustomFieldSchema = new Schema({
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  },
  label: {
    type: String,
    trim: true
  }
});

CustomFieldSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if(!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

module.exports = mongoose.model("CustomField", CustomFieldSchema);