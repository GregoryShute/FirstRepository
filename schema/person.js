var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var personSchema = new Schema({
  username: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  salt: { type: String, required: true },
  friends: [String],
  inboundRequests: [String],
  outboundRequests: [String],
  email: { type: String, required: true },
  altEmails: [String],
  privacy: String,
  friendIds: [{ type : Schema.Types.ObjectId}],
  outboundPostIds: [{ type : Schema.Types.ObjectId}], 
  inboundPostIds: [{ type : Schema.Types.ObjectId}]
});

var personModel = mongoose.model('Person', personSchema, 'Person');

module.exports = personModel;