require("dotenv").config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

const refund = new mongoose.Schema({
    AccountOwner: {
        type: String,
        required: true,
        unique: false
    },
    user_id: {
        type: String,
        required: true,
        unique: false
    },
    NameOfBank: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: false
    },
    VideoChatAccountId: {
        type: String,
        required: true,
        unique: false
    },
    BankCountry: {
        type: Object,
        required: true,
        unique: false,
    },
    BankKey: {
        type: String,
        required: true,
        unique: false,
    },
    BankAccountNumber: {
        type: String,
        required: true,
        unique: false,
    },
    ABARoutingNumber: {
        type: Date,
        required: false,
        unique: false,
    },
    IBAN: {
        type: String,
        required: false,
        unique: false,
    },
    SWIFCode: {
        type: String,
        required: false,
        unique: false,
    },
    ControlKey: {
        type: String,
        required: false,
        unique: false,
    },
    Address: {
        type: String,
        required: false,
        unique: false,
    },
    DUNSNumber: {
        type: String,
        required: false,
        unique: false,
    }

}, { strict: false });

refund.plugin(mongooseFieldEncryption, {
    fields: ["email", "user_id", "BankKey", "ABARoutingNumber", "VideoChatAccountId", "IBAN", "SWIFCode", "ControlKey", "Address", "DUNSNumber", "BankAccountNumber", "NameOfBank", "AccountOwner", "BankCountry"],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
    }
});

var Refund = mongoose.model('Refund', refund);
module.exports = Refund;