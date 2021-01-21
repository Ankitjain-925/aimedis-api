require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Cart = new Schema({
    user_id: {
        type: String,
        required: true,
        default: ''
      },
    cartList : [],
},{ strict: false })

module.exports = mongoose.model('Cart', Cart);