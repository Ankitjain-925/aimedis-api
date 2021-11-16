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
    name:{
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
    fields: ["name", "image", "profile_id", "alies_id"],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
} });

var invoiceSchema = new Schema({
    patient: ProfessionalInfo,
    status: {
        type: Object,
        required: false,
        unique: false
    },
    invoice_id:{
        type: String,
        required: false,
        unique: false
    },
    created_at: {
        type: String,
        required: false,
        unique: false
    },
    services:{
        type: Array,
        required: false,
        unique: false
    },
    total_amount:{
        type: Number,
        required: false,
        unique: false
    },
    house_id: {
        type: String,
        required: true,
        unique: false
    },
    case_id: {
        type: String,
        required: true,
        unique: false
    }
},{ strict: false });

invoiceSchema.plugin(mongooseFieldEncryption, { fields: [ "invoice_id" ], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });
var virtual_Invoice = mongoose.model('virtual_invoice', invoiceSchema);
module.exports = virtual_Invoice;