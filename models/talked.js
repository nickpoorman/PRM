/**
 * Talked Schema
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TalkedSchema = new Schema({
  when: {
    type: Date
  },
  about: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model("Talked", TalkedSchema);