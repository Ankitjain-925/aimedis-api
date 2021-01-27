require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

var payment = new Schema({
    user_id: {
        type: String,
        required: true,
        default: ''
      },
    userName:{
        type: String,
        required: false,
        default: ''
    },
    userType:{
        type: String,
        required: true,
        default: ''
    },
    paymentData: {
        type: Object
    },
    _enc_paymentData:{
        type: Boolean,
        required: false,
        unique: false
    },
    _enc_orderlist:{
        type: Boolean,
        required: false,
        unique: false
    },
    paymentDate:{
        type: Date,
        default: Date.now
    },
   orderlist:{
        type: Object,
        required: false,
        unique:false
    }
},{ strict: false })

payment.plugin(mongooseFieldEncryption, { fields: [ "user_id","userName","userType"], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });

module.exports = mongoose.model('payment', payment);