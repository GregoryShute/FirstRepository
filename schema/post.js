var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  content: { type: String, minlength: 1, maxlength: 250 },
  person: { type: String, required: true, unique: true },
  privacy: String,
  postedTo: String,
  created_at: Date,
  updated_at: Date
});


var post = mongoose.model('post', postSchema);

module.exports = post;