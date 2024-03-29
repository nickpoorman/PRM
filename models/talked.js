/**
 * Talked Schema
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TalkedSchema = new Schema({
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  },
  when: {
    type: Date
  },
  about: {
    type: String,
    trim: true
  }
});

TalkedSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if(!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

module.exports = mongoose.model("Talked", TalkedSchema);