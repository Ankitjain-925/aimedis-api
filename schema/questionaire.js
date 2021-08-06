require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

var QuesSchema = new mongoose.Schema({
    questions:{
        type: Array,
        required: true,
        unique: false
    },
    house_id: {
        type: String,
        required: true,
        unique: false
    },
    house_logo: {
        type: String,
        required: false,
        unique: false
    },
    house_name: {
        type: String,
        required: true,
        unique: false
    },
  
},{ strict: false });
QuesSchema.plugin(mongooseFieldEncryption, {
    fields: ["house_id","house_name"],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
} });
var questionaire = mongoose.model('questionaire',QuesSchema);
module.exports =  questionaire ;