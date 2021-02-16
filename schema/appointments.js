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
     speciality :{ type : Array },
    subspeciality : { type: Array },
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


var appointmentsSchema = new Schema({
    patient:{
        type:String,
        required:false,
        unique:false
    },
    doctor_id:{
        type:String,
        required:false,
        unique:false
    },
    appointment_type : {
        type:String,
        required:false,
        unique:false
    },
    date:{
        type:Date,
        required:false,
        unique:false
    },
    start_time:{
        type:String,
        required:false,
        unique:false
    },
    end_time:{
        type:String,
        required:false,
        unique:false
    },
    insurance:{
        type:String,
        required:false,
        unique:false
    },
    insurance_number:{
        type:String,
        required:false,
        unique:false
    },
    status:{
        type:String,
        required:false,
        unique:false
    },
    annotations:{
        type:String,
        required:false,
        unique:false
    },
    accept_datetime: {
        type: String,
        required:false,
        unique:false
    },
    custom_text :{
        type: String,
        required: false,
        unique: false
     },
    patient_info :patient_infos,
    docProfile :docProfiles
},{ strict: false });

appointmentsSchema.plugin(mongooseFieldEncryption, { fields: [ "appointment_type","patient", "doctor_id", "insurance", "annotations" ], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });

var Appointments = mongoose.model('Appointments', appointmentsSchema);

module.exports = Appointments;
