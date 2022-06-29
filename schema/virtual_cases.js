require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

const ProfessionalInfo = new mongoose.Schema({
    image:{
        type: String,
        required: false,
        unique: false
    },
    first_name:{
        type: String,
        required: false,
        unique: false
    },
    last_name:{
        type: String,
        required: false,
        unique: false
    },
    profile_id:{
        type: String,
        required: false,
        unique: false
    },
    alies_id:{
        type: String,
        required: false,
        unique: false
    }
},{ strict: false });

ProfessionalInfo.plugin(mongooseFieldEncryption, {
    fields: ["first_name", "last_name", "image", "profile_id", "alies_id"],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
} });

var CaseSchema = new Schema({
    speciality:{
        type: Object,
        required: false,
        unique: false
    },
    case_number:{
      type: String,
      required: true,
      unique: false
    },
    patient:{
        type: Object,
        required: false,
        unique: false
    },
    wards: {
        type: Object,
        required: false,
        unique: false
    },
    rooms: {
        type: Object,
        required: false,
        unique: false
    },
    bed:{
        type: String,
        required: false,
        unique: false
    },
    inhospital: {
        type: Boolean,
        required: false,
        unique: false
    },
    house_id:{
        type: String,
        required: true,
        unique: false
    },
    patient_id: {
        type: String,
        required: true,
        unique: false
    },
    total_task: {
        type: String,
        required: false,
        unique: false
    },
    total_comments:{
        type: String,
        required: false,
        unique: false
    },
    done_task: { 
        type: String,
        required: false,
        unique: false
    },
    entries:  {    
        type: String,
        required: false,
        unique: false
    },
    step: {
        type: String,
        required: false,
        unique: false
    },
    document_file: {
        type: String,
        required: false,
        unique: false
    },
    status:{
        type: Number,
        required: false,
        unique: false  
    },
    viewQuestionaire:{
        type: Boolean,
        required: false,
        unique: false
    },
    submitQuestionaire:{
        type: Boolean,
        required: false,
        unique: false
    },
    verifiedbyPatient:{
        type: Boolean,
        required: false,
        unique: false
    },
    added_at: {
        type: Date,
    },
    discharged_at: {
        type: Date,
    },
    assinged_to: [ProfessionalInfo],
},{ strict: false });

CaseSchema.plugin(mongooseFieldEncryption, { fields: [ "case_number","house_id","patient_id","total_task","status","total_comments","bed","done_task" ], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });
var virtual_Case = mongoose.model('virtual_case', CaseSchema);
module.exports = virtual_Case;