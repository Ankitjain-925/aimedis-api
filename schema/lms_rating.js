require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

var ratingSchema= new Schema({
    courseID:{
        type: String,
        required: false,
        unique: false
    },
    user_id:{
        type: String,
        required: false,
        unique:false
    },
    user_profile_id:{
        type: String,
        required: false,
        unique: false
    },
    rating:{
        type: Number,
        required: false,
        unique: false
    },
    short_message:{
        type: String,
        required: false,
        unique:false
    },
    addedDate :{
        type: String,
        required: false,
        unique:false
    }
},{ strict: false }) 

ratingSchema.plugin(mongooseFieldEncryption, { fields: [ "user_id","user_profile_id","short_message"], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });


module.exports = mongoose.model('Rating', ratingSchema); 