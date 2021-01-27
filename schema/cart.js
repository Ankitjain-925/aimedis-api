require('dotenv').config();
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

var Cart = new Schema({
    user_id: {
        type: String,
        required: true,
        default: ''
      },
    cartList : [],
},{ strict: false })

Cart.plugin(mongooseFieldEncryption, { fields: ["user_id"], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });
module.exports = mongoose.model('Cart', Cart);