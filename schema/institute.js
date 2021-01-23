require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

var Institutes = new Schema({
   institute_name:{
        type: String,
        required: false,
        unique: false
   },
   created_by: {
       type: String,
       required: false,
       unique: false
   }
},{ strict: false });

Institutes.plugin(mongooseFieldEncryption, { fields: [ "institute_name", "created_by"], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });

var Institute = mongoose.model('Institute', Institutes);
module.exports = Institute;
