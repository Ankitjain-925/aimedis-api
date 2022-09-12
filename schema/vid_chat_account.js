require("dotenv").config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption =
  require("mongoose-field-encryption").fieldEncryption;

  const VideoChatAccount = new mongoose.Schema({
    patient_id:{
        type: String,
        required: false,
        unique: false
    },
   
     reg_amount:{
        type: String,
        required: false,
        unique: false
     },
     email: {
        type: String,
        required: false,
        unique: false
     },

     password:{
        type: String,
        required: true,
        unique: false,
     },
     prepaid_talktime:{
        type: String,
        required: false,
        unique: false,
     },
     status:{
       type: String,
       required: true,
       unique: false,
     }, 
     date:{ 
       type: Date,
       required: false,
       unique: false,
    },
    username:{
      type: String,
       required: true,
       unique: true,
    },
     is_payment:{
        type: Boolean,
        required: false,
        unique: false,
      },
      payment_data: {
         type: Object,
        required: false,
        unique: false,
      }
 
},{ strict: false });

VideoChatAccount.plugin(mongooseFieldEncryption, {
    fields: ["password","reg_amount","email", "patient_id","username"],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });



var Video_chat_Account = mongoose.model('Video_chat_Account', VideoChatAccount);
module.exports = Video_chat_Account;