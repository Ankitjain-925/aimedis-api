require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

const docProfiles = new mongoose.Schema({
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
     email: {
        type: String,
        required: false,
        unique: false
     },
     profile_image: {
        type: String,
        required: false,
        unique: false
     },
},{ strict: false });

docProfiles.plugin(mongooseFieldEncryption, {
    fields: ["email",  "last_name", "first_name", "patient_id"],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
} });

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
     email: {
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
    bucket : {  
        type: String,
        required: false,
        unique: false
    },
},{ strict: false });

patient_infos.plugin(mongooseFieldEncryption, {
    fields: ["bucket", "birthday","email",  "last_name", "first_name", "patient_id"],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });


var second_optionschema = new Schema({
    patient_id:{
        type:String,
        required:false,
        unique:false
    },
    patient_email : {
        type:String,
        required:false,
        unique:false
    },
    doctor_id : {
        type:String,
        required:false,
        unique:false
    },
    patient_profile_id: {
        type:String,
        required:false,
        unique:false
    },
    first_name : {
        type:String,
        required:false,
        unique:false
    },

    last_name : {
        type:String,
        required:false,
        unique:false
    },

    birthday : {
        type:String,
        required:false,
        unique:false
    },

    profile_image : {
        type:String,
        required:false,
        unique:false
    },
    user_id:{
        type:String,
        required:false,
        unique:false
    },
    specialist:{
        type:String,
        required:false,
        unique:false
    },
    online_offline:{
        type:String,
        required:false,
        unique:false
    },
    speciality:{
        type:String,
        required:false,
        unique:false
    },
    how_are_you:{
        type:String,
        required:false,
        unique:false
    },
    know_diseases:{
        type:String,
        required:false,
        unique:false
    },
    medication:{
        type:String,
        required:false,
        unique:false
    },
    allergies:{
        type:String,
        required:false,
        unique:false
    },
    professions:{
        type:String,
        required:false,
        unique:false
    },
    details:{
        type:String,
        required:false,
        unique:false
    },
    documents:{
        type:Array,
        required:false,
        unique:false
    },
    attachfile:{
        type:Array,
        required:false,
        unique:false
    },
    status : {
        type:String,
        required:false,
        unique:false
    },
    patient_info :patient_infos,
    docProfile :docProfiles
}, { strict: false });

second_optionschema.plugin(mongooseFieldEncryption, { fields: [ "professions","details",
    "patient_id", "doctor_id", "patient_email", "patient_profile_id","know_diseases",
     "first_name","last_name", "birthday", "profile_image","medication","speciality",
     "allergies","how_are_you","online_offline","specialist","user_id"
    ], secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
      } });
var Second_option = mongoose.model('Second_option', second_optionschema);

module.exports = Second_option;
