var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  owner: { type: String, required: true, unique: true }, //must be friends with the post owner to view
  content: { type: String, minlength: 1, maxlength: 250 }, 
  privacy: String,
  parent: String,
  postedTo: String,
  children: [String],
  created_at: Date,
  updated_at: Date
});


var post = mongoose.model('post', postSchema);

module.exports = post;