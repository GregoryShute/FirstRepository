var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var personSchema = new Schema({
  username: { type: String, required: true, unique: true }, //not to concerned about having to query on this at sign up and sign in
  //because this will only grow linearly with the number of users unlike posts
  hashedPassword: { type: String, required: true },
  salt: { type: String, required: true },
  //friends: [String],
  //inboundRequests: [String],
  //outboundRequests: [String],
  email: { type: String, required: true },
  altEmails: [String],
  privacy: String,
  
  //friendIds: [{ type : Schema.Types.ObjectId}],
  //inboundRequestsIds: [{ type : Schema.Types.ObjectId}],
  //outboundRequestsIds: [{ type : Schema.Types.ObjectId}],
  
  friends: [],
  inboundRequests: [],
  outboundRequests: [],
  
  myPosts: [],
  othersPosts: [],
  
  myPostIds: [{ type : Schema.Types.ObjectId}], 
  othersPostIds: [{ type : Schema.Types.ObjectId}]
});

var personModel = mongoose.model('Person', personSchema, 'Person');

module.exports = personModel;