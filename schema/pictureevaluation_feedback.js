require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;


const patient_infos = new mongoose.Schema({
    patient_id:{
        type: String,
        required: false,
        unique: false
    },
    first_name: {
        type: String,
        required: false,
        unique: false
     },
     last_name: {
        type: String,
        required: false,
        unique: false
     },
     profile_image: {
        type: String,
        required: false,
        unique: false
     },
     birthday :{  
        type: String,
        required: false,
        unique: false
     },
     profile_id : { 
        type: String,
        required: false,
        unique: false
     }
},{ strict: false });

patient_infos.plugin(mongooseFieldEncryption, {
    fields: [""],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });


var feedback = new Schema({
    fast_service: {
        type: String,
        required: true,
        default: ''
      },
    doctor_explaination:{
        type: String,
        required: false,
        default: ''
    },
    satification:{
        type: String,
        required: true,
        default: ''
    },
    doctor_id:{
        type: Array,
        required: false,
        unique: false
    },
    task_id:{
        type: String,
        required: false,
        unique: true
    },
    patient_infos:[patient_infos]
 
},{ strict: false })



feedback.plugin(mongooseFieldEncryption, { fields: [""], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });

module.exports = mongoose.model('feedback', feedback);