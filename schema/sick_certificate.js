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
     }
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


var sickCertificateSchema = new Schema({
    patient_id : {
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
    doctor_type : {
        type:String,
        required:false,
        unique:false
    },
    status : {
        type:String,
        required:false,
        unique:false
    },
    country : {
        type:String,
        required:false,
        unique:false
    },
    how_are_you : {
        type:String,
        required:false,
        unique:false
    },
    fever : {
        type:String,
        required:false,
        unique:false
    },
    which_symptomps : {
        type:String,
        required:false,
        unique:false
    },
    since_when : {
        type:String,
        required:false,
        unique:false
    },
    which_symptomp_first : {
        type:String,
        required:false,
        unique:false
    },
    time_unable_work : {
        type:String,
        required:false,
        unique:false
    },
    same_problem_before : {
        type:String,
        required:false,
        unique:false
    },
    known_diseases : {
        type:String,
        required:false,
        unique:false
    },
    medication : {
        type:String,
        required:false,
        unique:false
    },
    allergies : {
        type:String,
        required:false,
        unique:false
    },
    professions : {
        type:String,
        required:false,
        unique:false
    },
    annotations : {
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
    accept_datetime: {
        type: String,
        required:false,
        unique:false
    },
    docs:{
        type:Object,
        required:false,
        unique:false
    },
    attachfile:{
        type:Array,
        required:false,
        unique:false
    },
    send_on:{
        type:String,
        required:false,
        unique:false
    },
    patient_info :patient_infos,
    docProfile :docProfiles
}, { strict: false });

sickCertificateSchema.plugin(mongooseFieldEncryption, { fields: [ "professions", "known_diseases",
    "patient_id", "doctor_id", "annotations", "patient_email", "patient_profile_id","same_problem_before",
     "first_name","last_name", "birthday", "profile_image","medication","time_unable_work","which_symptomp_first",
     "allergies","since_when","which_symptomps","fever","how_are_you","country",
    ], secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
      } });
var Sick_certificate = mongoose.model('Sick_certificate', sickCertificateSchema);

module.exports = Sick_certificate;
