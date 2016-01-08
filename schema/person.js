var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var personSchema = new Schema({
  username: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  salt: { type: String, required: true },
  friends: [String],
  requests: [String],
  outboundRequests: [String],
  email: { type: String, required: true }
});

var personModel = mongoose.model('Person', personSchema, 'Person');

module.exports = personModel;