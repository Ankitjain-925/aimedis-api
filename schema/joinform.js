require("dotenv").config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;



const joinform = new mongoose.Schema({
    type: {
        type: String,
        required: false,
        unique: false,
    },
    speciality: {
        type: String,
        required: false,
        unique: false
    },
    email: {
        type: String,
        required: false,
        unique: false
    },
    first_name: {
        type: String,
        required: false,
        unique: false,
    },
    last_name: {
        type: String,
        required: false,
        unique: false,
    },
    dateofbirth: {
        type: String,
        required: false,
        unique: false,
    },
    city: {
        type: String,
        required: false,
        unique: false,
    },
    address: {
        type: String,
        required: false,
        unique: false,
    },
    country: {
        type: Object,
        required: false,
        unique: false,
    },
    
}, { strict: false });
joinform.plugin(mongooseFieldEncryption, {
    fields: ["email", "type", "speciality","first_name", "last_name", "address", "city", "dateofbirth", "country",],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
    }
});

var JoinForm = mongoose.model('JoinForm', joinform);
module.exports = JoinForm;