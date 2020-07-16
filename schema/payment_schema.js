var mongoose = require("mongoose");
var Schema = mongoose.Schema;

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
module.exports = mongoose.model('payment', payment);