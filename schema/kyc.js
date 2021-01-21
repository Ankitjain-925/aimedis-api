require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

var KYCschema = new Schema({
    user_id:{
        type: String,
        required: true,
        unique: false
    },
    country:{
      type: String,
      required: false,
      unique: false
    },
    number: {
       type: String,
       required: false,
       unique: false
    },
    authority: {
       type: String,
       required: false,
       unique: false
    },
    attachment:{
       type: Array,
       required: false,
       unique: false
    }
    
},{ strict: false });

KYCschema.plugin(mongooseFieldEncryption, { fields: [ "authority", "number", "country", "user_id" ], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });
var kyc = mongoose.model('kyc', KYCschema);
module.exports = kyc;
 