require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

const Questions = new mongoose.Schema({
    type: {
        type: String,
        required: false,
        unique: false
     },
     question:{
        type: String,
        required: false,
        unique: false 
     },
     options:{
        type: Array,
        required: false,
        unique: false 
     },
     title: {
        type: String,
        required: false,
        unique: false 
     },
     description :{
        type: String,
        required: false,
        unique: false 
     },
},{ strict: false });

Questions.plugin(mongooseFieldEncryption, {
    fields: [""],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
} });

var QuesSchema = new mongoose.Schema({
    questions:[Questions],
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