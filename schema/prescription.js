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
    mobile:{
        type: String,
        required: false,
        unique: false
    }
},{ strict: false });

patient_infos.plugin(mongooseFieldEncryption, {
    fields: ["bucket", "birthday","email",  "last_name", "first_name", "patient_id", "mobile"],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });

var PrescriptionSchema = new Schema({
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
    status : {
        type:String,
        required:false,
        unique:false
    },
    malignant_diseases : {
        type:String,
        required:false,
        unique:false
    },
    follow_up_prescription : {
        type:String,
        required:false,
        unique:false
    },
    musculosceletal_diseases : {
        type:String,
        required:false,
        unique:false
    },
    substance : {
        type:String,
        required:false,
        unique:false
    },
    eye_diseases : {
        type:String,
        required:false,
        unique:false
    },
    dose : {
        type:String,
        required:false,
        unique:false
    },
    infectious_diseases : {
        type:String,
        required:false,
        unique:false
    },
    trade_name : {
        type:String,
        required:false,
        unique:false
    },
    medication : {
        type:String,
        required:false,
        unique:false
    },
    atc_code : {
        type:String,
        required:false,
        unique:false
    },
    manufacturer : {
        type:String,
        required:false,
        unique:false
    },
    pack_size : {
        type:String,
        required:false,
        unique:false
    },
    allergies : {
        type:String,
        required:false,
        unique:false
    },
    pulmonary_diseases : {
        type:String,
        required:false,
        unique:false
    },
    renal_diseases : {
        type:String,
        required:false,
        unique:false
    },
    endrinologic_diseases : {
        type:String,
        required:false,
        unique:false
    },
    hypertension : {
        type:String,
        required:false,
        unique:false
    },
    diabetes : {
        type:String,
        required:false,
        unique:false
    },
    thyroid_diseases : {
        type:String,
        required:false,
        unique:false
    },
    liver_diseases : {
        type:String,
        required:false,
        unique:false
    },
    prescription_type : {
        type:String,
        required:false,
        unique:false
    },
    country : {
        type:String,
        required:false,
        unique:false
    }
    ,heart_diseases : {
        type:String,
        required:false,
        unique:false
    },
    accept_datetime: {
        type: String,
        required:false,
        unique:false
    },
    attachfile:{
        type:Array,
        required:false,
        unique:false
    },
    annotations : {
        type:String,
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
}, { strict: false })


PrescriptionSchema.plugin(mongooseFieldEncryption, { fields: [
"patient_id", "doctor_id", "annotations", "patient_email", "patient_profile_id","atc_code", "pack_size",
 "first_name","last_name", "birthday", "profile_image","medication","dose", "trade_name", "manufacturer",
 "allergies", "diagnosis",
], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });
var Prescription = mongoose.model('prescription',PrescriptionSchema);

module.exports = Prescription;