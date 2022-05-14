require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;


const Answers = new mongoose.Schema({
    rating: {
        type: String,
        required: false,
        unique: false
     },
     options:{
        type: Array,
        required: false,
        unique: false 
     },
     otheranswer: {
        type: String,
        required: false,
        unique: false 
     },
     question_id :{
        type: String,
        required: false,
        unique: false 
     },
},{ strict: false });

Answers.plugin(mongooseFieldEncryption, {
    fields: [""],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
} });

var AnswSchema = new mongoose.Schema({
    answers:[Answers],
    questionaire_id:{
        type: String,
        required: true,
        unique: false
    },
    patient:{
        type: Object,
        required: false,
        unique: false
    },
    patient_id:{
        type: String,
        required: true,
        unique: false
    },
    house_name: {
        type: String,
        required: true,
        unique: false
    },
    house_logo: {
        type: String,
        required: false,
        unique: false
    },
    house_id: {
        type: String,
        required: true,
        unique: false
    },
    created_at: {
        type: String,
        required: false,
        unique: false
    },

},{ strict: false });
AnswSchema.plugin(mongooseFieldEncryption, {
    fields: ["question_id","patient_id","house_id","house_logo","house_name","questionaire_id"],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
} });
var  answerspatient= mongoose.model('answerspatient',AnswSchema);
module.exports = answerspatient ;