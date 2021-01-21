require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

var SettingSchema = new Schema({
    user_id:{
        type: String,
        required: true,
        unique: false
    },
    user_profile_id:{
      type: String,
      required: false,
      unique: true
    },
    date_format: {
       type: String,
       required: false,
       unique: false
    },
    time_format: {
       type: String,
       required: false,
       unique: false
    },
    mode: {
       type: String,
       required: false,
       unique: false
    },
    language: {
       type: String,
       required: false,
       unique: false
    }
},
{ strict: false },
);


SettingSchema.plugin(mongooseFieldEncryption, { fields: [ "date_format", "time_format", "mode", "language","user_profile_id"], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });

var Setting = mongoose.model('Setting', SettingSchema);
module.exports = Setting;
 