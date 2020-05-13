var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var Topic = new Schema({
  topic_name:{
        type: String,
        required: false,
        unique: false
   },
});

var Topic = mongoose.model('Topic', Topic);
module.exports = Topic;