require("dotenv").config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

const applicationform = new mongoose.Schema({
    type: {
        type: String,
        required: false,
        unique: false,
    },
    subject_area: {
        type: String,
        required: false,
        unique: false,
    },
    additional_designation: {
        type: String,
        required: false,
        unique: false,
    },
    licence: {
        type: Boolean,
        required: false,
        unique: false,
    },
    qualification: {
        type: String,
        required: false,
        unique: false,
    },
    organizationName: {
        type: String,
        required: false,
        unique: false
    },
    institue: {
        type: String,
        required: false,
        unique: false
    },
}, { strict: false });
applicationform.plugin(mongooseFieldEncryption, {
    fields: ["additional_designation", "type", "institue","organizationName","qualification","licence","subject_area"],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
    }
});

var ApplicationForm = mongoose.model('ApplicationForm', applicationform);
module.exports = ApplicationForm;