require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

var Topic = new Schema({
  topic_name:{
        type: String,
        required: false,
        unique: false
   },
},{ strict: false });


Topic.plugin(mongooseFieldEncryption, { fields: [ "topic_name" ], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });

var Topic = mongoose.model('Topic', Topic);
module.exports = Topic;