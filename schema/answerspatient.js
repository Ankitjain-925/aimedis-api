require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

var AnswSchema = new mongoose.Schema({
    question_id:{
        type: String,
        required: true,
        unique: false
    },

    question:{
        type: String,
        required: true,
        unique: false
    },

    selected_option:{
        type: String,
        required: false,
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

    house_id: {
        type: String,
        required: true,
        unique: false
    },

},{ strict: false });
AnswSchema.plugin(mongooseFieldEncryption, {
    fields: ["question_id","patient_id","house_id",],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
} });
var  answerspatient= mongoose.model('answerspatient',AnswSchema);
module.exports = answerspatient ;